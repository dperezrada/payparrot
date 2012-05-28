var request = require('request');

var host = 'localhost:3000';

account = {
	'email': 'demo@payparrot.com',
	'password': 'payparrot',
	'name': 'Demo',
	'startup': 'Payparrot',
	'url': 'http://localhost:3001',
	'callback_url': 'http://localhost:3001/welcome'
}


request.post({url: 'http://'+host+'/accounts', json: account}, function (e, r, body) {
	console.log("Account id: "+ r.body.id);
});