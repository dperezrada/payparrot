var Suscriptions = require('payparrot_models/objects/suscriptions.js');

exports.validate = function(req, res) {
	var params = req.query
	_id = 1
	account_id = 2
	params['_id'] = req.params.id_suscription;
	params['account_id'] = req.params.account_id;

	Suscriptions.findOne(params,function(err,suscription){
		if (suscription) {
			res.statusCode = 200;
			res.send(suscription);
		} else {
			res.statusCode = 404;
			res.send({});
		}
	});
}