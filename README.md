# Breeze Next

Breeze Next 34.1 is a modern dark design system for [Nextcloud](https://nextcloud.com),
inspired by KDE Breeze. It uses soft gray surfaces, restrained depth and five
accessible accent palettes while retaining the existing `breezedark` app ID and
stored preferences.

![Breeze Next screenshot](screenshot.png)

Maintained by [Jan Klotz](https://github.com/InklingSplasher) in the
[Breeze Next repository](https://github.com/InklingSplasher/nextcloud-breeze-dark).

## Compatibility

- Nextcloud 33
- Nextcloud 34
- PHP 8.2–8.5

The project is based on Breeze Dark 29.0.0. Breeze Next uses one shared theme
bundle, Dart Sass modules, a framework-free TypeScript runtime and Vue 3 settings
built with official Nextcloud components.

## Installation

Breeze Next 34.1 is a manually distributed fork and is not the version currently
published under the upstream Breeze Dark entry in the Nextcloud App Store. Build
and install the package from this repository instead.

### Build the package

Node.js 22, PHP and Composer are required:

```sh
npm ci
composer install
make check
make appstore
```

The installable archive is written to `build/breezedark.tar.gz` and contains a
top-level `breezedark` directory.

### Fresh installation

Replace `/var/www/nextcloud` if your Nextcloud root differs:

```sh
sudo tar -xzf build/breezedark.tar.gz -C /var/www/nextcloud/apps
sudo chown -R www-data:www-data /var/www/nextcloud/apps/breezedark
sudo -u www-data php /var/www/nextcloud/occ app:enable breezedark
sudo -u www-data php /var/www/nextcloud/occ upgrade
```

### Upgrade an existing installation

Back up the current app and its configuration before replacing it. Use an empty
backup directory for each rollout:

```sh
sudo install -d -m 0750 /var/backups/nextcloud-breezedark
sudo cp -a /var/www/nextcloud/apps/breezedark \
    /var/backups/nextcloud-breezedark/breezedark-before-upgrade
sudo -u www-data php /var/www/nextcloud/occ config:list breezedark \
    | sudo tee /var/backups/nextcloud-breezedark/config-breezedark.json >/dev/null

sudo -u www-data php /var/www/nextcloud/occ maintenance:mode --on
sudo mv /var/www/nextcloud/apps/breezedark \
    /var/backups/nextcloud-breezedark/breezedark-replaced
sudo tar -xzf build/breezedark.tar.gz -C /var/www/nextcloud/apps
sudo chown -R www-data:www-data /var/www/nextcloud/apps/breezedark
sudo -u www-data php /var/www/nextcloud/occ upgrade
sudo -u www-data php /var/www/nextcloud/occ maintenance:mode --off
```

If the upgrade fails, restore `breezedark-replaced` before disabling maintenance
mode. After a successful rollout, verify the instance:

```sh
sudo -u www-data php /var/www/nextcloud/occ status
sudo -u www-data php /var/www/nextcloud/occ integrity:check-core
sudo -u www-data php /var/www/nextcloud/occ integrity:check-app breezedark
```

Local development packages are unsigned unless an App Store developer certificate
is available. In that case the app integrity command reports that the missing app
signature is skipped; core integrity must still finish without errors.

## Usage

### Administration

Open `Settings > Administration > Theming > Breeze Next` to:

- enforce Breeze Next globally;
- theme login and guest pages;
- follow the browser's light/dark preference;
- choose Plasma, Iris, Coral, Mint or Honey as the server accent;
- add optional custom CSS in the collapsed expert section.

### Personal settings

Open `Settings > Personal > Appearance and accessibility > Breeze Next` to enable
the theme, configure automatic activation and inherit or override the server
accent. A personal accent also works when Breeze Next is globally enforced.

## Development

Generated production assets are written to `css/theme.css`, `css/guest.css`,
`css/settings.css`, `js/breezedark.js` and `js/settings.js`.

Run the full local gate before every commit:

```sh
npm ci
composer install
make check
make appstore
```

CI validates PHP 8.2 and 8.4 against OCP 33 and OCP 34. The local gate covers
formatting, Stylelint, TypeScript, ESLint, Vitest, PHP lint, PHP-CS-Fixer, Sass
without deprecation warnings and bundle-size budgets.

## Contributing

Create a focused branch, run the complete check and review the staged changes
before creating a signed commit:

```sh
git switch -c feature/<short-description>
npm ci
composer install
make check
git status --short
git diff --check
git add -A
git diff --cached --stat
git commit -S -m "<type>: <description>"
git push -u origin HEAD
```

Use concise commits and keep unrelated changes separate. The signing and SSH
prompts intentionally remain interactive. Do not commit `node_modules`, `vendor`,
build staging directories, local certificates or Nextcloud configuration exports.

## Issues and credits

Report bugs and styling requests in the
[fork issue tracker](https://github.com/InklingSplasher/nextcloud-breeze-dark/issues).

Breeze Next is derived from
[Breeze Dark by Magnus Walbeck](https://github.com/mwalbeck/nextcloud-breeze-dark)
and remains licensed under AGPL-3.0-or-later.
