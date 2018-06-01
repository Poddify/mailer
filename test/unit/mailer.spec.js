import proxyquire from 'proxyquire';
import sinon from 'sinon';
import Chance from 'chance';
import { expect } from 'chai';

const chance = new Chance();
const MODULE = '../../src/mailer';
const loadModule = stubs => proxyquire(MODULE, {
    ...stubs
}).default;

describe('Feature: Mailer module', () => {
    it('Scenario: initializes the nodemailer transport', () => {
        const apiKey = chance.guid();
        const domain = chance.url();
        const mailgunTransport = Symbol('configured mailgun transport');
        const finalMailer = Symbol('configured nodemailer');
        const mailgun = sinon.stub();
        const createTransport = sinon.stub();
        const nodemailer = { createTransport };

        const Mailer = loadModule({
            nodemailer,
            'nodemailer-mailgun-transport': mailgun
        });

        mailgun.withArgs({
            auth: {
                api_key: apiKey,
                domain
            }
        }).returns(mailgunTransport);
        createTransport.withArgs(mailgunTransport).returns(finalMailer);

        const mailer = new Mailer({
            apiKey,
            domain
        });

        expect(mailer.mailer, 'should capture nodemailer as a class variable').to.equal(finalMailer);
    });

    it('Scenario: sends some mail', () => {
        const from = Symbol('from email');
        const to = Symbol('to email');
        const subject = Symbol('email subject line');
        const template = Symbol('raw email body');
        const data = Symbol('email template data');
        const html = Symbol('parsed email body');
        const injectParameters = sinon.stub();
        const sendMail = sinon.stub();
        const mailer = { sendMail };

        const Mailer = loadModule({
            './util/inject-parameters': injectParameters,
            nodemailer: {
                createTransport: () => mailer
            },
            'nodemailer-mailgun-transport': () => undefined
        });

        new Mailer({})
            .send({
                from,
                to,
                subject,
                template,
                data
            });

        injectParameters.withArgs(template, data).returns(html);

        expect(sendMail.callCount, 'should invoke mailer.sendMail').to.equal(1);
        expect(sendMail.firstCall.args).to.deep.equal([{
            from,
            to,
            subject,
            html
        }]);
    });
});
