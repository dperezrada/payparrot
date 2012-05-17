var async = require('async');

async.parallel([
    function(callback){
    	//Create notification
		async.forEach(
			[1,2], 
			function(item, callback){
				setTimeout(function(){
		            console.log(item);callback();
		        }, 2000*item);
			}, 
			function(result){}
		);
    },
    function(callback){
    	//Create next payment
		async.forEach(
			[3,4], 
			function(item, callback){
				setTimeout(function(){
		            console.log(item);callback();
		        }, 500);
			}, 
			function(result){}
		);
    },
], function(err){

});

a = new Date ('Tue, 15 May 2012 22:07:06 GMT');
console.log(a.getFullYear());