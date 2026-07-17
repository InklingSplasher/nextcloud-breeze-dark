# This file is licensed under the Affero General Public License version 3 or
# later. See the COPYING file.

app_name=breezedark
build_directory=$(CURDIR)/build
sign_directory=$(build_directory)/sign
cert_directory=$(HOME)/.nextcloud/certificates

.PHONY: all dev-setup npm-init prettier prettier-fix stylelint stylelint-fix \
	typecheck eslint test php-lint php-test php-cs check watch build appstore sign-package

all: dev-setup check

dev-setup: npm-init

npm-init:
	npm ci

prettier:
	npm run prettier

prettier-fix:
	npm run prettier:fix

stylelint:
	npm run stylelint

stylelint-fix:
	npm run stylelint:fix

typecheck:
	npm run typecheck

eslint:
	npm run eslint

test:
	npm test

php-lint:
	find lib templates -name '*.php' -print0 | xargs -0 -n1 php -l

php-test:
	php tests/php/accent.php

php-cs:
	vendor/bin/php-cs-fixer fix --dry-run --diff --allow-risky=yes --sequential

check: prettier stylelint typecheck eslint test php-lint php-test php-cs build

watch:
	npm run watch

build:
	npm run build

appstore:
	rm -rf $(build_directory)
	mkdir -p $(sign_directory)
	rsync -a --prune-empty-dirs \
	--exclude=".git" \
	--exclude=".composer-cache" \
	--exclude=".tools" \
	--exclude=".github" \
	--exclude=".tx" \
	--exclude=".vscode" \
	--exclude="build" \
	--exclude="node_modules" \
	--exclude="vendor" \
	--exclude=".gitignore" \
	--exclude=".php-cs-fixer.cache" \
	--exclude=".php-cs-fixer.dist.php" \
	--exclude=".prettierignore" \
	--exclude=".prettierrc" \
	--exclude=".stylelintignore" \
	--exclude=".stylelintrc.json" \
	--exclude="composer.json" \
	--exclude="composer.lock" \
	--exclude="eslint.config.js" \
	--exclude="css/*.map" \
	--exclude="*.scss" \
	--exclude="scripts" \
	--exclude="src" \
	--exclude="tests" \
	--exclude="tsconfig.json" \
	--exclude="vite.config.ts" \
	--exclude="Makefile" \
	--exclude="package-lock.json" \
	--exclude="package.json" \
	--exclude="screenshot.png" \
	$(CURDIR)/ $(sign_directory)/$(app_name)
	@if [ -f $(cert_directory)/$(app_name).key ]; then \
		echo "Signing app files…"; \
		php ../occ integrity:sign-app \
			--privateKey=$(cert_directory)/$(app_name).key\
			--certificate=$(cert_directory)/$(app_name).crt\
			--path=$(sign_directory)/$(app_name); \
	fi
	tar czf $(build_directory)/$(app_name).tar.gz \
		-C $(sign_directory) $(app_name)

sign-package:
	openssl dgst -sha512 -sign $(cert_directory)/$(app_name).key $(build_directory)/$(app_name).tar.gz | openssl base64;
