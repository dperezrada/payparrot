echo "ACTIVATE ENVIROMENT"
source configs/test;
if [[ $# == 0 ]]; then
	echo "Usage: ./runtest.sh <api|dal|scripts>"
	exit 1;
fi



for test in ${@}; do
	if [[ 'api' == $test ]]; then
		echo "API AUTO TESTS"
		nosetests api/tests/auto -x;
	fi
	if [[ 'dal' == $test ]]; then
		echo "API DAL TESTS"
		nosetests dal/tests -x;
	fi
	if [[ 'scripts' == $test ]]; then
		echo "API SCRIPTS TESTS"
		nosetests scripts/tests -sx;
	fi 
done



#echo "SCRIPTS TESTS"
#nosetests scripts/tests $@
