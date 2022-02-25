start:
	@npm start

test:
	@npm run test:ci

build:
	@make install
	@make ready
	@npm run prepublish

ready:
	@make prettier
	@make lint
	@make docs

prettier:
	@npm run prettier

lint:
	@npm run lint

docs:
	@npm run docs

install:
	@echo "Removing package-lock and node_modules\n"
	@rm -rf package-lock.json node_modules
	@echo "\nClearing cache\n"
	@npm cache clean -f
	@echo "\nInstalling all dependencies\n"
	@npm install
	@echo "\nDone"

.PHONY: start ready build test prettier lint docs
