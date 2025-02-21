/*
JustMail/resolveMailHost.js

Simple email package for Node.js.

by JustNode Dev Team / JustApple
*/

//load node packages
const dns = require('dns').promises;

//resolve mail host
async function resolveMailHost(domain) {
	try {
		//resolve all records
		const records = await dns.resolveMx(domain);
		
		//check exists
		if (!records || records.length == 0) return null;
		
		//return highest priority record
		return records.reduce((p, c) => (p.priority < c.priority) ? p : c).exchange;
	} catch { //could not resolve mx record
		return null;
	}
}

//export
module.exports = resolveMailHost;