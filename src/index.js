/*
JustMail

Simple email package for Node.js.

by JustNode Dev Team / JustApple
*/

//export
module.exports = {
	smtp: require('./smtp/index.js'),
	parseAddress: require('./parseAddress.js'),
	resolveMailHost: require('./resolveMailHost.js')
};