import nodemailer from 'nodemailer';
import mailgun from 'nodemailer-mailgun-transport';
import injectParameters from './util/inject-parameters';

export default class Mailer {
    mailer;

    constructor(options) {
        this.initializeTransport(options);
    }

    initializeTransport(options) {
        const transport = mailgun({
            auth: {
                api_key: options.apiKey,
                domain: options.domain
            }
        });

        this.mailer = nodemailer.createTransport(transport);
    }

    send(options) {
        const emailBody = injectParameters(options.template, options.data);

        this.mailer.sendMail({
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: emailBody
        });
    }
}
