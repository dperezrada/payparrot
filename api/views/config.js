var config = {}

if (process.env.STATE == "PRODUCTION") {
	config.AWS_KEY = "AKIAIN47MW5VQ4RBN7TQ";
	config.AWS_PRIVATE = "SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx";
	config.queues_urls = {
		"notifications": "/229116634218/notifications",
		"payments" : "/229116634218/payments"	
	}
} 

if (process.env.STATE == "DEVELOPMENT" || process.env.STATE="") {
	config.AWS_KEY = "AKIAIN47MW5VQ4RBN7TQ";
	config.AWS_PRIVATE = "SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx";
	config.queues_urls = {
		"notifications": "/229116634218/notifications_test",
		"payments" : "/229116634218/payment_test"	
	}	
}

if (process.env.STATE == "TEST") {
	config.AWS_KEY = "AKIAIN47MW5VQ4RBN7TQ";
	config.AWS_PRIVATE = "SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx";
	config.queues_urls = {
		"notifications": "/229116634218/notifications_test",
		"payments" : "/229116634218/payment_test"	
	}	
}

module.exports = config;