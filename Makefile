npmbin := $(shell npm bin)

all: lint lib docs
	npm ci

lib: src/*
	npm run transpile

test: v12. v14. v15.

v%:
	n $@; \
	npm run clean:all; \
	npm i && \
	npm run ci

docs: README.md
	markedpp --githubid -i README.md -o README.md
	jsdox -o docs src/Holidays.js

lint:
	npm run lint

.PHONY: all doc lint test
