echo "API TESTS"
nosetests api/tests $@
echo "DAL TESTS"
nosetests dal/tests $@
