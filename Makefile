npmbin := $(shell npm bin)

all: lint lib docs
	npm test

lib: src/*
	npm run transpile

test: v4. v6. v8.

v%:
	n $@ && npm test

docs: README.md
	markedpp --githubid -i README.md -o README.md
	jsdox -o docs src/Holidays.js

lint:
	npm run lint

.PHONY: all doc lint test
