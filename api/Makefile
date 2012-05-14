API_TEST = $(shell find test/api -name "*.js" -type f | sort)

test:
	@./node_modules/.bin/mocha --reporter spec -b -t 3500 $(API_TEST)

.PHONY: test
