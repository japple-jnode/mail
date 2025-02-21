/*
JustMail/smtp/relax.js

Simple email package for Node.js.

by JustNode Dev Team / JustApple
*/

//make headers relaxed
function canonicalizeHeaders(header) {
	return header.toLowerCase().replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').replace(/\s+$/mg, '');
}