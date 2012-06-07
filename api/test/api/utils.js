var assert = require('assert');
exports.create_and_login = function(account, request, callback){
	request.post({url: 'http://localhost:3000/accounts', json: account}, function (e, r, body) {
		assert.equal(201, r.statusCode);
		account.id = r.body.id;
		delete account.password;
		request.post(
			{
				url: 'http://localhost:3000/login',
				json: {
					'email': 'daniel@payparrot.com',
	       			'password': '123'
				},
				followRedirect: false
			},
			function (e, r, body) {
				assert.equal(302, r.statusCode);
				assert.equal('http://localhost:3000/logged', r.headers.location);
				callback();
			}
		);
	});
};