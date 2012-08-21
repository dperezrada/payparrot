echo "ACTIVATE ENVIROMENT"
source configs/test;
if [[ $# == 0 ]]; then
	echo "Usage: ./runtest.sh <api|dal|scripts>"
	exit 1;
fi



for test in ${@}; do
	if [[ 'api' == $test ]]; then
		echo "API AUTO TESTS"
		nosetests api/tests/auto;
	fi
	if [[ 'dal' == $test ]]; then
		echo "API DAL TESTS"
		nosetests dal/tests;
	fi
	if [[ 'scripts' == $test ]]; then
		echo "API SCRIPTS TESTS"
		nosetests scripts/tests -s;
	fi 
done



#echo "SCRIPTS TESTS"
#nosetests scripts/tests $@
