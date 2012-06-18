var request = require('request');

var host = 'payparrot.com';

account = {
	'email': 'demo1@payparrot.com',
	'password': 'payparrot',
	'name': 'Demo1',
	'startup': 'Payparrot',
	'url': 'http://demo.payparrot.com',
	'callback_url': 'http://localhost:3001/welcome'
}


request.post({url: 'https://'+host+'/accounts', json: account}, function (e, r, body) {
	console.log("Account id: "+ r.body.id);
});