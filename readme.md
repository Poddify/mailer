# WIP: @poddify/mailer

A lightweight library for sending email

## Installation

```
$ npm i --save @poddify/mailer
```

## Usage

```js
import Mailer from '@poddify/mailer';

const mailer = new Mailer({
    apiKey: MY_API_KEY,
    domain: MY_MAILGUN_DOMAIN
});

mailer.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: SUBJECT,
    template: EMAIL_TEMPLATE,
    data: EMAIL_TEMPLATE_DATA
});
```

### mailer.send

Sends an email

| Option   | Description        |
|----------|--------------------|
| from     | from email address |
| to       | to email address   |
| subject  | subject line       |
| template | email HTML         |
| data     | template data      |

## Email Templates

Email templates are expected to be HTML contents and are provided to `mailer.send` via the `template` parameter. The HTML string provided will be injected with data using the `data` parameter. To inject string data into your email body, simply add `{{DATA_PARAM}}` within the HTML contents, where `DATA_PARAM` is the object key in `options.data`

```js
mailer.send({
    template: '<h1>{{title}}</h1>',
    data: {
        title: 'Hello World'
    }
});
```
