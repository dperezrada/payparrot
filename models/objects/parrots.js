var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore'),
	returnJSON = require('./utils').returnJSON;

var parrots_schema = new Schema({
	twitter_id: String,
	oauth_token: String,
	oauth_token_secret: String,
	external_id: String,
	twitter_info: {}
});

mongoose.model('Parrots', parrots_schema);
module.exports = Parrots = mongoose.model('Parrots');

Parrots.prototype.returnJSON = returnJSON;


// doc = { twitter_id:  '27193612', oauth_token: 'lalalala', oauth_token_secret: 'lelelele' };
// doc2 = { twitter_id:  '8664412', oauth_token: 'lalalala', oauth_token_secret: 'lelelele' };
// doc3 = { twitter_id: '14254403', oauth_token: 'lalalala', oauth_token_secret: 'lelelele' };
// doc4 = { twitter_id:'208177184', oauth_token: 'lalalala', oauth_token_secret: 'lelelele' };
// doc5 = { twitter_id:'134207366', oauth_token: 'lalalala', oauth_token_secret: 'lelelele' };

// db.parrots.insert(doc);
// db.parrots.insert(doc2);
// db.parrots.insert(doc3);
// db.parrots.insert(doc4);
// db.parrots.insert(doc5);