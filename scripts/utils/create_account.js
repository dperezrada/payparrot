var request = require('request');

var host = 'www.payparrot.com';

account = {
	'email': 'demo@payparrot.com',
	'password': 'payparrot',
	'name': 'Demo',
	'startup': 'Payparrot',
	'url': 'http://demo.payparrot.com',
	'callback_url': 'http://demo.payparrot.com/welcome'
}


request.post({url: 'http://'+host+'/accounts', json: account}, function (e, r, body) {
	console.log("Account id: "+ r.body.id);
});