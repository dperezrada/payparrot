var request = require('superagent');
var assert = require('assert');

describe('/accounts are the corps that have bought the product', function(){
  describe('Create an account', function(){
    it('should create an account successfully ', function(done){
      	request
			.post('http://localhost:3000/accounts')
			.set('Content-Type', 'application/json')
			.send({
		        'email': 'daniel@payparrot.com',
		        'name': 'Daniel',
		        'startup': 'Payparrot',
		        'url': 'http://payparrot.com/',
			})
 			.end(function(res1){
				assert.equal(201,res1.statusCode);
				var id = res1.body.id;
				console.log("ID: "+id);
				request.get('http://localhost:3000/accounts/'+id).end(function(res2){
					assert.equal(200,res2.statusCode);
					assert.deepEqual({
				        'email': 'daniel@payparrot.com',
				        'name': 'Daniel',
				        'startup': 'Payparrot',
				        'url': 'http://payparrot.com/',
					},res2.body);
					done();
				});
 			});
		})
	})
})