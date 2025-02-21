/*
JustMail/smtp/client.js

Simple email package for Node.js.

by JustNode Dev Team / JustApple
*/

//load node packages
const crypto = require('crypto');

//load functions and classes
const parseAddress = require('./../parseAddress.js');
const SMTPClientConnection = require('./clientConnection.js');
const resolveMailHost = require('./../resolveMailHost.js');

//SMTP client
class SMTPClient {
	constructor(address) {
		this.address = address;
		
		//parse email address
		const parsed = parseAddress(address);
		this.user = parsed.user;
		this.domain = parsed.domain;
	}
	
	async sendMail(to = this.address, subject = 'Subject', body = 'Hello, world.', options) {
		//create new connection
		const connection = new SMTPClientConnection(this);
		
		//parse target address
		const targetHost = parseAddress(to);
		
		//connect to target server
		await connection.connect(await resolveMailHost(targetHost.domain), options);
		
		//hello
		await connection.sendCommand(`EHLO ${this.domain}\r\n`);
		
		//start tls
		await connection.sendCommand('STARTTLS\r\n'); //start tls connect
		connection.startTls();
		
		//send mail commands
		await connection.sendCommand(`MAIL FROM:<${this.address}>\r\n`); //from
		await connection.sendCommand(`RCPT TO:<${to}>\r\n`); //to
		
		//send mail content
		await connection.sendCommand('DATA\r\n') //start command
		await connection.sendCommand(
			`Date: ${(new Date()).toUTCString()}\r\n` + //current date
			`From: ${this.address}\r\n` +
			`To: ${to}\r\n` +
			`Subject: ${subject}\r\n` +
			`Message-ID: <${crypto.randomUUID()}@${this.host}>\r\n\r\n` +
			body +
			'\r\n.\r\n'
		);
		
		//end connect
		await connection.sendCommand('QUIT\r\n');
		
		return;
	}
}

//export
module.exports = SMTPClient;