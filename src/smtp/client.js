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
	constructor(address, options = {}) {
		this.address = address;
		
		//parse email address
		const parsed = parseAddress(address);
		this.user = parsed.user;
		this.domain = parsed.domain;
		
		//options
		this.customName = options.customName;
		this.requireTls = options.requireTls;
	}
	
	async sendMail(to = this.address, subject = 'Subject', body = 'Hello, world.', options) {
		//create new connection
		const connection = new SMTPClientConnection(this);
		
		//parse target address
		const targetHost = parseAddress(to);
		
		//connect to target server
		await connection.connect(await resolveMailHost(targetHost.domain), options);
		
		//hello
		let extensions = (await connection.sendCommand(`EHLO ${this.domain}\r\n`)).contents;
		
		//start tls
		if (extensions.includes('STARTTLS')) {
			await connection.sendCommand('STARTTLS\r\n'); //start tls connect
			await connection.startTls();
			
			//hello again
			extensions = (await connection.sendCommand(`EHLO ${this.domain}\r\n`)).contents;
		} else if (this.requireTls) {
			//end connect
			await connection.sendCommand('QUIT\r\n');
			connection.socket.destroy();
			
			//throw error
			throw new Error('Target server does not support TLS, but required by client.')
		}
		
		//send mail commands
		await connection.sendCommand(`MAIL FROM:<${this.address}>\r\n`); //from
		await connection.sendCommand(`RCPT TO:<${to}>\r\n`); //to
		
		//send mail content
		await connection.sendCommand('DATA\r\n') //start command
		await connection.sendCommand(
			`Date: ${(new Date()).toUTCString()}\r\n` + //current date
			`From: ${this.customName ? `"${this.customName}" ` : ''}${this.address}\r\n` +
			`To: ${to}\r\n` +
			`Subject: ${subject}\r\n` +
			`Message-ID: <${crypto.randomUUID()}@${this.domain}>\r\n\r\n` +
			body +
			'\r\n.\r\n'
		);
		
		//end connect
		await connection.sendCommand('QUIT\r\n');
		connection.socket.destroy();
		
		return;
	}
}

//export
module.exports = SMTPClient;