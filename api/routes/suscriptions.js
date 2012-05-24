 Suscriptions = require('payparrot_models/objects/suscriptions.js'),

 exports.validate = function(req, res) {
 	Suscriptions.findOne({_id: req.params.id_suscription},function(err,suscription){
 		if (suscription) {
 			res.statusCode = 200;
 			res.send(suscription);
 		} else {
 			res.statusCode = 404;
 			res.send({});
 		}
 	});
 }