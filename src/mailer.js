import Mailgun from 'mailgun-js';
import injectParameters from './util/inject-parameters';

export default class Mailer {
    constructor(options) {
        this.mailer = Mailgun({
            apiKey: options.apiKey,
            domain: options.domain
        });
    }

    send(options) {
        return this.mailer.messages().send({
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: injectParameters(options.template, options.data)
        });
    }
}
