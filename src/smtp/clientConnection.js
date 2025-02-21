/*
JustMail/smtp/clientConnection.js

Simple email package for Node.js.

by JustNode Dev Team / JustApple
*/

//load node packages
const net = require('net');
const tls = require('tls');
const readline = require('readline');

//SMTP client connection
class SMTPClientConnection {
	constructor(client, socket) {
		this.client = client;
		this.initSocket(socket);
	}
	
	//init socket and readline
	initSocket(socket) {
		this.socket = socket ?? new net.Socket();
		this.rl = readline.createInterface({ input: this.socket, terminal: false, crlfDelay: Infinity });
	}
	
	//connect to SMTP server
	async connect(host, options) {
		this.socket.connect({ host: host, port: 25, ...options });
		
		//receive response
		let response = { contents: [], code: 0 };
		
		//event callback
		let cb;
		await new Promise((resolve, reject) => {
			cb = (line) => {
				response.contents.push(line.slice(4));
				response.code = line.slice(0, 3);
				if (line[3] !== '-') resolve();
			};
			
			this.rl.on('line', cb);
		});
		
		//remove listener
		this.rl.removeListener('line', cb);
		
		//return greetings response
		return response;
	}
	
	//send command
	async sendCommand(command) {
		//auto add CRLF to command
		if (!command.endsWith('\r\n')) command += '\r\n';
		
		//write command to socket
		this.socket.write(command);
		
		//receive response
		let response = { contents: [], code: 0 };
		
		//event callback
		let cb;
		await new Promise((resolve, reject) => {
			cb = (line) => {
				response.contents.push(line.slice(4));
				response.code = line.slice(0, 3);
				if (line[3] !== '-') resolve();
			};

			this.rl.on('line', cb);
		});
		
		//remove listener
		this.rl.removeListener('line', cb);
		
		//return
		return response;
	}
	
	startTls(options) {
		this.initSocket(tls.connect({ socket: this.socket, ...options }));
	}
}

//export
module.exports = SMTPClientConnection;