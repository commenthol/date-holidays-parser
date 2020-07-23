npmbin := $(shell npm bin)

all: lint lib docs
	npm ci

lib: src/*
	npm run transpile

test: v10. v12. v14.

v%:
	n $@ && npm test

docs: README.md
	markedpp --githubid -i README.md -o README.md
	jsdox -o docs src/Holidays.js

lint:
	npm run lint

.PHONY: all doc lint test
