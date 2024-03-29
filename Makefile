npmbin := $(shell npm bin)

all: lint lib docs
	npm run ci

lib: src/*
	npm run build

test: v14 v16 v17

v%:
	n $@; \
	npm run ci
	#npm run clean:all; \
	#npm i && \
	#npm run ci

docs: README.md
	markedpp --githubid -i README.md -o README.md
	jsdox -o docs src/Holidays.js

lint:
	npm run lint

.PHONY: all doc lint test
