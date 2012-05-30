var mongoose = require('mongoose'),
	mongo_url = require('payparrot_models/libs/mongodb').mongo_url({}),
	db = mongoose.connect(mongo_url),
	assert = require('assert'),
	Suscription = require('payparrot_models/objects/suscriptions');

suite('Suscriptions', function(){
	var self;
	setup(function(done){
		done();
	});
	
	teardown(function(done){
		require('../../api/test/tear_down').remove_all(done);
	});

	suite('returnJSON', function(){
		test('getOne ', function(done){
			var suscription = new Suscription();
			Suscription.findOne({}, {}, function(err, result){
				done();
			});
		});
	});

});