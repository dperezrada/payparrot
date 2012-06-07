var assert = require('assert');
var create_and_login_common = function(account, request, email, callback){
		request.post({url: 'http://localhost:3000/accounts', json: account}, function (e, r, body) {
		assert.equal(201, r.statusCode);
		account.id = r.body.id;
		delete account.password;
		request.post(
			{
				url: 'http://localhost:3000/login',
				json: {
					'email': account.email,
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
}

exports.create_and_login = function(account, request, callback){
	create_and_login_common(account, request, null, callback);
};

exports.create_and_login_parrot = function(account, request, email, callback){
	create_and_login_common(account, request, email, callback);
};