var mongoose = require('mongoose'),
	generate_mongo_url = require('./libs/mongodb'),
	mongo_url = generate_mongo_url({}),
	db = mongoose.connect(mongo_url),
	assert = require('assert'),
	Accounts = require('./models/accounts');

suite('Accounts', function(){
	setup(function(done){
		this.account_data = {
	        'email': 'daniel@payparrot.com',
	        'password': '123',
	        'name': 'Daniel',
	        'startup': 'Payparrot',
	        'url': 'http://payparrot.com/',
		};
		this.account = new Accounts(this.account_data);
		this.account.save(function(){
			done();
		});

	});

	suite('Instance', function(){
		test('Should override method toJSON', function(){
			var expected_account = {
		        'email': 'daniel@payparrot.com',
		        'name': 'Daniel',
		        'startup': 'Payparrot',
		        'url': 'http://payparrot.com/',
			};
			var received_account = this.account.returnJSON();
			expected_account['id'] = received_account['id'];
			
			assert.deepEqual(expected_account, received_account);
		});
	});
});