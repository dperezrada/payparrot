API_TEST = $(shell find api/test/api -name "*.js" -type f | sort)
MODELS_TEST = $(shell find models/test -name "*.js" -type f | sort)

test:
	@PARROT_DB_NAME=payparrot_test ./api/node_modules/.bin/mocha --reporter spec -b -t 3500 $(API_TEST)
	@PARROT_DB_NAME=payparrot_test ./models/node_modules/.bin/mocha --ui tdd --reporter spec -b $(MODELS_TEST)

test_prod:
	@PARROT_DB_NAME=payparrot_1 ./api/node_modules/.bin/mocha --reporter spec -b -t 3500 api/test/api/parrots/pay/test_start_pay.js
.PHONY: test
