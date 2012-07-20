echo "API TESTS"
nosetests api/tests/auto $@
echo "DAL TESTS"
nosetests dal/tests $@
#echo "SCRIPTS TESTS"
#nosetests scripts/tests $@
