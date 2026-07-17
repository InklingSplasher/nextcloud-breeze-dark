<?php

declare(strict_types=1);

/**
 * Breeze Dark theme for Nextcloud
 *
 * @copyright Copyright (C) 2020 Magnus Walbeck <mw@mwalbeck.org>
 * @copyright Copyright (C) 2026 inkcurity.net
 *
 * @license GNU AGPL version 3 or any later version
 */

namespace OCA\BreezeDark\Settings;

use OCA\BreezeDark\Theme\Accent;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\Config\IUserConfig;
use OCP\IAppConfig;
use OCP\IURLGenerator;
use OCP\IUserSession;
use OCP\Settings\ISettings;

class Personal implements ISettings {
	private ?string $userId;

	public function __construct(
		private string $appName,
		private IAppConfig $appConfig,
		private IUserConfig $userConfig,
		IUserSession $userSession,
		private IURLGenerator $urlGenerator,
	) {
		$this->userId = $userSession->getUser()?->getUID();
	}

	public function getForm(): TemplateResponse {
		if ($this->userId === null) {
			throw new \RuntimeException('Breeze Dark personal settings require an authenticated user');
		}

		$defaultAutomaticActivation = $this->appConfig->getValueString(
			$this->appName,
			'theme_automatic_activation_enabled',
			'0',
		);
		$serverAccent = Accent::serverDefault(
			$this->appConfig->getValueString($this->appName, 'theme_default_accent', Accent::Plasma->value),
		);
		$userAccent = $this->userConfig->getValueString(
			$this->userId,
			$this->appName,
			'theme_accent',
			Accent::USER_DEFAULT,
		);
		if (!Accent::isValidUserValue($userAccent)) {
			$userAccent = Accent::USER_DEFAULT;
		}

		return new TemplateResponse('breezedark', 'personal', [
			'themeEnforced' => $this->appConfig->getValueString($this->appName, 'theme_enforced', '0') === '1',
			'themeEnabled' => $this->userConfig->getValueString($this->userId, $this->appName, 'theme_enabled', '0') === '1',
			'themeAutomaticActivation' => $this->userConfig->getValueString(
				$this->userId,
				$this->appName,
				'theme_automatic_activation_enabled',
				$defaultAutomaticActivation,
			) === '1',
			'themeAccent' => $userAccent,
			'resolvedAccent' => Accent::resolve($userAccent, $serverAccent->value)->value,
			'themeDefaultAccent' => $serverAccent->value,
			'settingsUrl' => $this->urlGenerator->linkToRoute('breezedark.Settings.personal'),
		]);
	}

	public function getSection(): string {
		return 'theming';
	}

	public function getPriority(): int {
		return 50;
	}
}
