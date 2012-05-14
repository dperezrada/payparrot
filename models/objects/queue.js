var aws = require ('aws-lib');

var awsKey = "AKIAIN47MW5VQ4RBN7TQ";
var awsPrivateKey = "SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx";

var queues_urls = {
	'notifications': '/229116634218/notifications_test',
	"payments" : "/229116634218/payment_test"	
}

exports.createMessage = function(queue, message, callback){
	sqs = aws.createSQSClient(awsKey, awsPrivateKey, {'path': queues_urls[queue]});
	sqs.call( "SendMessage", message, function (err, result) {
		if(err || result['Error']){
			callback('Couldnt send message');
		}
		else{
			callback();
		}
	});
};