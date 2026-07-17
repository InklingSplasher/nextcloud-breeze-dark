<?php

declare(strict_types=1);

/**
 * Breeze Dark theme for Nextcloud
 *
 * @copyright Copyright (C) 2020  Magnus Walbeck <mw@mwalbeck.org>
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

namespace OCA\BreezeDark\AppInfo;

use OCA\BreezeDark\Listener\BeforeTemplateRenderedListener;
use OCA\BreezeDark\Theme\Accent;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\Config\IUserConfig;
use OCP\IAppConfig;
use OCP\IURLGenerator;
use OCP\IUserSession;
use OCP\Util;

class Application extends App implements IBootstrap {

	/** @var string */
	public const APP_NAME = 'breezedark';

	public function __construct() {
		parent::__construct(self::APP_NAME);
	}

	public function register(IRegistrationContext $context): void {
		$context->registerEventListener(BeforeTemplateRenderedEvent::class, BeforeTemplateRenderedListener::class);
	}

	public function boot(IBootContext $context): void {
		$context->injectFn([$this, 'doTheming']);
	}

	/**
	 * Check if the theme should be applied
	 *
	 */
	public function doTheming(
		IAppConfig $appConfig,
		IUserConfig $userConfig,
		IUserSession $userSession,
		IURLGenerator $urlGenerator,
	): void {
		$user = $userSession->getUser();
		$enforced = $appConfig->getValueString(self::APP_NAME, 'theme_enforced', '0') === '1';
		$loginPage = $appConfig->getValueString(self::APP_NAME, 'theme_login_page', '1') === '1';
		$cachebuster = $appConfig->getValueString(self::APP_NAME, 'theme_cachebuster', '0');
		$automaticActivation = $appConfig->getValueString(self::APP_NAME, 'theme_automatic_activation_enabled', '0') === '1';
		$serverAccent = $appConfig->getValueString(
			self::APP_NAME,
			'theme_default_accent',
			Accent::Plasma->value,
		);
		$userAccent = Accent::USER_DEFAULT;

		if ($enforced) {
			if ($user !== null) {
				$userAccent = $userConfig->getValueString(
					$user->getUID(),
					self::APP_NAME,
					'theme_accent',
					Accent::USER_DEFAULT,
				);
				$automaticActivation = $userConfig->getValueString(
					$user->getUID(),
					self::APP_NAME,
					'theme_automatic_activation_enabled',
					$automaticActivation ? '1' : '0',
				) === '1';
			}
			$this->addStyling(
				$urlGenerator,
				$loginPage,
				$cachebuster,
				$automaticActivation,
				Accent::resolve($userAccent, $serverAccent),
			);
		} elseif ($user !== null && $userConfig->getValueString($user->getUID(), self::APP_NAME, 'theme_enabled', '0') === '1') {
			// When shown the 2FA login page you are logged in while also being on a login page,
			// so a logged in user still needs the guests.css stylesheet
			$automaticActivation = $userConfig->getValueString(
				$user->getUID(),
				self::APP_NAME,
				'theme_automatic_activation_enabled',
				'0',
			) === '1';
			$userAccent = $userConfig->getValueString(
				$user->getUID(),
				self::APP_NAME,
				'theme_accent',
				Accent::USER_DEFAULT,
			);
			$this->addStyling(
				$urlGenerator,
				$loginPage,
				$cachebuster,
				$automaticActivation,
				Accent::resolve($userAccent, $serverAccent),
			);
		}
	}

	/**
	 * Add stylesheet(s) to nextcloud
	 *
	 */
	public function addStyling(
		IURLGenerator $urlGenerator,
		bool $loginPage,
		string $cachebuster,
		bool $automaticActivation,
		Accent $accent,
	): void {
		Util::addStyle(self::APP_NAME, 'theme');
		Util::addScript(self::APP_NAME, 'breezedark');
		Util::addHeader('meta', [
			'name' => 'breeze-next-accent',
			'content' => $accent->value,
		]);
		Util::addHeader('meta', [
			'name' => 'breeze-next-automatic',
			'content' => $automaticActivation ? '1' : '0',
		]);

		// If the styling for the login page is wanted, load the stylesheet.
		if ($loginPage) {
			Util::addStyle(self::APP_NAME, 'guest');
		}

		// Only request the stylesheet if there is any styling to request
		if ($cachebuster !== '' && $cachebuster !== '0') {
			$linkToCustomStyling = $urlGenerator->linkToRoute(
				'breezedark.Theming.getCustomStyling',
				['v' => $cachebuster,]
			);
			Util::addHeader(
				'link',
				[
					'rel' => 'stylesheet',
					'href' => $linkToCustomStyling,
				]
			);
		}
	}
}
