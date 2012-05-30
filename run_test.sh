DIR=`dirname $0`
cd $DIR

# Saving previously setted variables
PRE_PAYPARROT_ENV=$PAYPARROT_ENV;

# Setting new variables
export PAYPARROT_ENV=test

mkdir -p logs
echo "Starting the server"
nohup node api/app.js payparrot_test > logs/server.log &
sleep 1;

echo "Running tests"
API_TEST=`find api/test/api -name "*.js" -type f | sort`
MANUAL_TEST=`find api/test/manual -name "*.js" -type f | sort`
MODELS_TEST=`find models/test -name "*.js" -type f | sort`

#CHECK which test to run
MANUAL=0
API=0
MODELS=0
for arg in "$@"
do
	if [[ $arg == 'manual' || $arg == 'all' ]]; then
		MANUAL=1;
	fi
	if [[ $arg == 'models' || $arg == 'all' ]]; then
		MODELS=1;
	fi
	if [[ $arg == 'api' || $arg == 'all' ]]; then
		API=1;
	fi
done

if [[ $MANUAL == 1 ]]; then
	./api/node_modules/.bin/mocha --reporter spec -b -t 50000 $MANUAL_TEST
fi
if [[ $API == 1 ]]; then
	./api/node_modules/.bin/mocha --reporter spec -b -t 5000 $API_TEST
fi
if [[ $MODELS == 1 ]]; then
	./models/node_modules/.bin/mocha --ui tdd --reporter spec -b -t 10000 $MODELS_TEST
fi




PROCESS_ID=`ps -ef | grep "node" | grep "payparrot_test" | grep -v "grep" | awk '{print $2}'`;
echo "Stopping server, process_id: $PROCESS_ID"
kill $PROCESS_ID;

# Setting variables to their original value
export PAYPARROT_ENV=$PRE_PAYPARROT_ENV
