var _ = require('underscore');

exports.returnJSON = function(){
	var to_return = this.toJSON();
	_.each(this.schema.tree, function(value, key){
		if(value.private){
			delete to_return[key];
		}
	});
	to_return['id'] = to_return['_id'];
	delete to_return['_id'];
	return to_return;
};