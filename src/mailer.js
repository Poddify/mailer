import nodemailer from 'nodemailer';
import mailgun from 'nodemailer-mailgun-transport';
import injectParameters from './util/inject-parameters';

const createTransport = options => mailgun({
    auth: {
        api_key: options.apiKey,
        domain: options.domain
    }
});

export default class Mailer {
    constructor(options) {
        const transport = createTransport(options);

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
