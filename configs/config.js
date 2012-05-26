var config = {}

if (process.env.PAYPARROT_ENV.toLowerCase() == "production") {
	config.AWS_KEY = "AKIAIN47MW5VQ4RBN7TQ";
	config.AWS_PRIVATE = "SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx";
	config.queues_urls = {
		"notifications": "/229116634218/notifications",
		"payments" : "/229116634218/payments"	
	}
} 

if (process.env.PAYPARROT_ENV.toLowerCase() == "development" || !process.env.PAYPARROT_ENV) {
	config.AWS_KEY = "AKIAIN47MW5VQ4RBN7TQ";
	config.AWS_PRIVATE = "SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx";
	config.queues_urls = {
		"notifications": "/229116634218/notifications_test",
		"payments" : "/229116634218/payment_test"	
	}	
}

if (process.env.PAYPARROT_ENV.toLowerCase() == "test") {
	config.AWS_KEY = "AKIAIN47MW5VQ4RBN7TQ";
	config.AWS_PRIVATE = "SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx";
	config.queues_urls = {
		"notifications": "/229116634218/notifications_test",
		"payments" : "/229116634218/payment_test"	
	}	
}

module.exports = config;