<?php

declare(strict_types=1);

/**
 * Breeze Dark theme for Nextcloud
 *
 * @copyright Copyright (C) 2023  Magnus Walbeck <mw@mwalbeck.org>
 *
 * @author Magnus Walbeck <mw@mwalbeck.org>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\BreezeDark\Migration;

use OCP\Config\IUserConfig;
use OCP\IAppConfig;
use OCP\IConfig;
use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;

class MigrateUserThemeSettings implements IRepairStep {
	public function __construct(
		private IAppConfig $appConfig,
		private IUserConfig $userConfig,
		private IConfig $systemConfig,
	) {
	}

	public function getName(): string {
		return 'Migrate user theme settings';
	}

	public function run(IOutput $output): void {
		$settingsVersion = $this->appConfig->getValueString('breezedark', 'theme_settings_version', '0');

		if ($settingsVersion >= '3') {
			return;
		}

		foreach ($this->userConfig->searchUsersByValueString('breezedark', 'theme_enabled', '1') as $userId) {
			$enabledThemes = json_decode(
				$this->userConfig->getValueString($userId, 'theming', 'enabled-themes', '[]'),
				true,
			);
			if (!is_array($enabledThemes)) {
				$enabledThemes = [];
			}

			$key = array_search('breezedark', $enabledThemes);

			if ($key !== false) {
				unset($enabledThemes[$key]);
			}

			$this->userConfig->setValueString(
				$userId,
				'theming',
				'enabled-themes',
				json_encode(array_values(array_unique($enabledThemes)), JSON_THROW_ON_ERROR),
			);
		}

		$currentEnforcedTheme = $this->systemConfig->getSystemValueString('enforce_theme', '');

		if ($currentEnforcedTheme === 'breezedark') {
			$this->systemConfig->setSystemValue('enforce_theme', 'dark');
		}

		$this->appConfig->setValueString('breezedark', 'theme_settings_version', '3');
	}
}
