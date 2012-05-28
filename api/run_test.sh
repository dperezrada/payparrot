DIR=`dirname $0`
cd $DIR

# Saving previously setted variables
PRE_MONGODB_DBNAME=$MONGODB_DBNAME
PRE_MONGODB_HOST=$MONGODB_HOST
PRE_MONGODB_PORT=$MONGODB_PORT

# Setting new variables
export PARROT_DB_NAME=payparrot_test
export PARROT_DB_HOST=localhost
export PARROT_DB__PORT=27017

mkdir -p logs
echo "Starting the server"
nohup node app.js payparrot_test > logs/server.log &
sleep 1;

echo "Running tests"
./node_modules/.bin/mocha -b;

PROCESS_ID=`ps -ef | grep "node" | grep "payparrot_test" | grep -v "grep" | awk '{print $2}'`;
echo "Stopping server, process_id: $PROCESS_ID"
kill $PROCESS_ID;

# Setting variables to their original value
export PARROT_DB_NAME=$PRE_MONGODB_DBNAME
export PARROT_DB_HOST=$PRE_MONGODB_HOST
export PARROT_DB_PORT=$PRE_MONGODB_PORT
