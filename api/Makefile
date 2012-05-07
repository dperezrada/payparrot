API_TEST = $(shell find test/api -name "*.js" -type f | sort)
MODELS_TEST = $(shell find test/models -name "*.js" -type f | sort)

test:
	@./node_modules/.bin/mocha --reporter spec -b $(API_TEST)
	@./node_modules/.bin/mocha --ui tdd --reporter spec -b $(MODELS_TEST)

.PHONY: test
