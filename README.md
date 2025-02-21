# JustMail

Simple email package for Node.js.

```shell
npm i @jnode/mail
```

> IMPORTANT NOTE: This is a package in early development, may contain many bugs and some features aren't finished yet, please use it carefully.

## Sending an email

```js
const smtp = require('@jnode/mail').smtp;
const c = new mail.SMTPClient('example@example.com');
c.sendMail(
  'example@example.com',
  'Subject',
  'Body',
  {
    localAddress: 'Local IP Address can be verify by SPF record.' // for multi internet connection use
  }
);
```
