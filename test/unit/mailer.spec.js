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
    it('Scenario: initializes the mailgun api', () => {
        const apiKey = chance.guid();
        const domain = chance.url();
        const mailgunApi = Symbol('configured mailgun api');
        const mailgun = sinon.stub();

        const Mailer = loadModule({
            'mailgun-js': mailgun
        });

        mailgun.withArgs({
            apiKey,
            domain
        }).returns(mailgunApi);

        const mailer = new Mailer({
            apiKey,
            domain
        });

        expect(mailer.mailer, 'should capture nodemailer as a class variable').to.equal(mailgunApi);
    });

    it('Scenario: sends some mail', () => {
        const from = Symbol('from email');
        const to = Symbol('to email');
        const subject = Symbol('email subject line');
        const template = Symbol('raw email body');
        const data = Symbol('email template data');
        const html = Symbol('parsed email body');
        const injectParameters = sinon.stub();
        const send = sinon.stub();
        const mailer = {
            messages: () => ({ send })
        };

        injectParameters.withArgs(template, data).returns(html);

        const Mailer = loadModule({
            './util/inject-parameters': {
                default: injectParameters
            },
            'mailgun-js': () => mailer
        });

        new Mailer({})
            .send({
                from,
                to,
                subject,
                template,
                data
            });

        expect(send.callCount, 'should invoke mailer.sendMail').to.equal(1);
        expect(send.firstCall.args).to.deep.equal([{
            from,
            to,
            subject,
            html
        }]);
    });
});
