var config = {
	DB: {}
}

if(!process.env.PAYPARROT_ENV){
	console.error('PAYPARROT_ENV VARIABLE is not defined');
}

if (process.env.PAYPARROT_ENV.toLowerCase() == "production") {
	config.AWS_KEY = "AKIAIN47MW5VQ4RBN7TQ";
	config.AWS_PRIVATE = "SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx";
	config.queues_urls = {
		"notifications": "/229116634218/notifications",
		"payments" : "/229116634218/payments"	
	}
	config.twitter_callback_url = 'https://payparrot.com/parrots/finish';
	config.DB.HOST = 'localhost';
	config.DB.PORT = 27017;
	config.DB.NAME = 'payparrot_1';
	config.DB.USER = '';
	config.DB.PASSWORD = '';
} 

if (process.env.PAYPARROT_ENV.toLowerCase() == "development" || !process.env.PAYPARROT_ENV) {
	config.AWS_KEY = "AKIAIN47MW5VQ4RBN7TQ";
	config.AWS_PRIVATE = "SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx";
	config.queues_urls = {
		"notifications": "/229116634218/notifications_test",
		"payments" : "/229116634218/payment_test"	
	}
	config.twitter_callback_url = 'http://localhost:3000/parrots/finish';
	config.DB.HOST = 'localhost';
	config.DB.PORT = 27017;
	config.DB.NAME = 'payparrot_dev';
	config.DB.USER = '';
	config.DB.PASSWORD = '';
}

if (process.env.PAYPARROT_ENV.toLowerCase() == "test") {
	config.AWS_KEY = "AKIAIN47MW5VQ4RBN7TQ";
	config.AWS_PRIVATE = "SThKjV6E8RMKNLdkHaeq4bj7QiDTu6NWGMSUOTCx";
	config.queues_urls = {
		"notifications": "/229116634218/notifications_test",
		"payments" : "/229116634218/payment_test"	
	}
	config.twitter_callback_url = 'http://localhost:3000/parrots/finish';
	config.twitter_callback_url = 'http://localhost:3000/parrots/finish';
	config.DB.HOST = 'localhost';
	config.DB.PORT = 27017;
	config.DB.NAME = 'payparrot_test';
	config.DB.USER = '';
	config.DB.PASSWORD = '';	
}

module.exports = config;
