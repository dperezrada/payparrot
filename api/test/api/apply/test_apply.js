var request = require('request'),
	assert = require('assert'),
	_ = require('underscore'),
	test_utils = require('../utils.js'),
	db = require('payparrot_models/libs/mongodb').connect(),
	PotentialUsers = require('payparrot_models/objects/potential_users');

describe('POST /apply', function(){
	before(function(done){
		done();
	});
	after(function(done){
		require('../../tear_down').remove_all(done);
	});
	it('should be able to apply', function(done){
		request.post(
			{
				url: 'http://localhost:3000/apply',
				json: {'name': 'Daniel', 'email': 'daniel@payparrot.com'}
			},
			function (e, r, body) {
				assert.equal(201, r.statusCode);
				PotentialUsers.findOne({email: 'daniel@payparrot.com'}, function(err, user){
					assert.equal(user.name, 'Daniel');
					assert.equal(user.email, 'daniel@payparrot.com');
					done();
				});
				
			}
		);
	});
});