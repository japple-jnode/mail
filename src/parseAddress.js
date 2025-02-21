/*
JustMail/parseAddress.js

Simple email package for Node.js.

by JustNode Dev Team / JustApple
*/

//parse email
function parseAddress(address) {
	//split by @
	const parts = address.split('@');
	
	//return
	return { user: parts[0], domain: parts[1] };
}

//export
module.exports = parseAddress;