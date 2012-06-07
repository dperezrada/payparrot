var aws = require ('aws-lib');
var config = require('payparrot_configs');


var awsKey = config.AWS_KEY;
var awsPrivateKey = config.AWS_PRIVATE;
var queues_urls = config.queues_urls;

exports.createMessage = function(queue, message, callback){
	var sqs = aws.createSQSClient(awsKey, awsPrivateKey, {'path': queues_urls[queue]});
	sqs.call( "SendMessage", message, function (err, result) {
		if(err || result['Error']){
			callback('Couldnt send message', null);
		}
		else{
			callback(null, result);
		}
	});
};

exports.getMessage = function(queue, callback){
	var sqs = aws.createSQSClient(awsKey, awsPrivateKey, {'path': queues_urls[queue]});
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
	var sqs = aws.createSQSClient(awsKey, awsPrivateKey, {'path': queues_urls[queue]});
	sqs.call ( "DeleteMessage", {'ReceiptHandle': receipt_handle}, function (err, message) {
		if(err || message.Error){
			callback(message.Error);
		}else{
			callback(null);
		}
	});
}