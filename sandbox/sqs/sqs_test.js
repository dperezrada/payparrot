var aws = require ('aws-lib');

var awsKey = "AKIAJ3K3RPWKT6EPASFA";
var awsPrivateKey = "NI24owBHKlFQKyBjZVKRw0SMnv4fXSLM8kPA8H/B";

// See "http://docs.amazonwebservices.com/AWSSimpleQueueService/latest/APIReference/"
// General SQS actions do not require a "path" (CreateQueue, ListQueue, etc)

// sqs = aws.createSQSClient( awsKey, awsPrivateKey);
// 
// sqs.call ( "ListQueues", {}, function (err, result) { 
//     console.log("ListQueues result: " + JSON.stringify(result)); 
// });


// Specific Queue options (CreateMessage, DeleteMessage, etc)
// need a specific path 
// http://sqs.us-east-1.amazonaws.com/123456789012/testQueue/
// /accountid/queue_name
var options = {
    "path" : "/442716120455/payparrot_notifications_test"  
};
var outbound = {
    MessageBody : "Test Message"  
};

sqs = aws.createSQSClient(awsKey, awsPrivateKey, options);

console.log("\ncreando mensaje");

sqs.call ( "SendMessage", outbound, function (err, create_message) {

	console.log("\n\nrecibiendo mensaje\n");
	sqs.call ( "ReceiveMessage", {}, function (err, message) {

	    console.log("\n\nMensaje no debería ser visible para otro usuario, no debería haber nada\n");
		sqs.call ( "ReceiveMessage", {}, function (err, empty_message) {
	    	console.log(empty_message);
			
			sqs.call ( "DeleteMessage", {'ReceiptHandle': message.ReceiveMessageResult.Message.ReceiptHandle}, function (err, deleted_message) {
	    		console.log('\n\nMensaje borrado\n');
		    	console.log(deleted_message);
			});
		});
	});

});