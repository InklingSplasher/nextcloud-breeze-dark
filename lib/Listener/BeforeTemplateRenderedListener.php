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

namespace OCA\BreezeDark\Listener;

use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\Config\IUserConfig;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\IAppConfig;
use OCP\IUserSession;

/** @implements IEventListener<BeforeTemplateRenderedEvent> */
class BeforeTemplateRenderedListener implements IEventListener {
	private const APP_ID = 'breezedark';

	public function __construct(
		private IUserSession $userSession,
		private IAppConfig $appConfig,
		private IUserConfig $userConfig,
	) {
	}

	public function handle(Event $event): void {
		if (!$event instanceof BeforeTemplateRenderedEvent) {
			return;
		}

		$response = $event->getResponse();
		$params = $response->getParams();
		$enabledThemes = $this->normalizeThemes($params['enabledThemes'] ?? []);

		if ($this->appConfig->getValueString(self::APP_ID, 'theme_enforced', '0') === '1') {
			$params['enabledThemes'] = array_values(array_unique(['breezedark', 'dark', ...$enabledThemes]));
			$response->setParams($params);
			return;
		}

		if ($response->getRenderAs() !== TemplateResponse::RENDER_AS_USER) {
			return;
		}

		$user = $this->userSession->getUser();
		if ($user === null) {
			return;
		}

		$userId = $user->getUID();
		if ($this->userConfig->getValueString($userId, self::APP_ID, 'theme_enabled', '0') !== '1') {
			return;
		}

		$storedThemes = json_decode(
			$this->userConfig->getValueString($userId, 'theming', 'enabled-themes', '[]'),
			true,
		);
		$params['enabledThemes'] = array_values(array_unique([
			'breezedark',
			...$enabledThemes,
			...$this->normalizeThemes($storedThemes),
		]));
		$response->setParams($params);
	}

	/**
	 * @return list<string>
	 */
	private function normalizeThemes(mixed $themes): array {
		if (!is_array($themes)) {
			return [];
		}

		return array_values(array_filter($themes, static fn (mixed $theme): bool => is_string($theme) && $theme !== ''));
	}
}
