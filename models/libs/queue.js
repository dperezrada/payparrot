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

exports.getMessage = function(queue, callback){
	sqs = aws.createSQSClient(awsKey, awsPrivateKey, {'path': queues_urls[queue]});
	sqs.call ( "ReceiveMessage", {}, function (err, message) {
		if(!err && message && message.ReceiveMessageResult && message.ReceiveMessageResult.Message){
			message.ReceiveMessageResult.Message.Body = JSON.parse(message.ReceiveMessageResult.Message.Body);
			callback(message.ReceiveMessageResult.Message);
		}else{
			callback(null);
		}
	});
}

exports.deleteMessage = function(queue, receipt_handle, callback){
	sqs = aws.createSQSClient(awsKey, awsPrivateKey, {'path': queues_urls[queue]});
	sqs.call ( "DeleteMessage", {'ReceiptHandle': receipt_handle}, function (err, message) {
		if(err || message.Error){
			callback(message.Error);
		}else{
			callback(null);
		}
	});
}

// sqs.call ( "DeleteMessage", {'ReceiptHandle': message.ReceiveMessageResult.Message.ReceiptHandle}, function (err, deleted_message) {
// 	console.log('\nMensaje borrado\n');
// 	console.log(deleted_message);
// });