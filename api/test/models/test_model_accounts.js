var mongoose = require('mongoose'),
	mongo_url = require('../../libs/mongodb').mongo_url({}),
	db = mongoose.connect(mongo_url),
	assert = require('assert'),
	Accounts = require('../../models/accounts');

suite('Accounts', function(){
	var self;
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
		self = this;

	});

	suite('returnJSON', function(){
		test('Should return only public attributes ', function(){
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

	suite('Mongoose', function(){
		test('Update should not save the password (not defined in the schema)', function(done){
			Accounts.update({'_id': self.account._id}, {'lala': 'hola'}, function(err, data){
				Accounts.findOne({_id: self.account._id}, {}, function (err, account){
					assert.equal(null, account.lala);
					done();
				});
			});
		});
	});
});