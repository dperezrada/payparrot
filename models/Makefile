MODELS_TEST = $(shell find test -name "*.js" -type f | sort)

test:
	@./node_modules/.bin/mocha --ui tdd --reporter spec -b $(MODELS_TEST)

.PHONY: test
