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
use OCP\IAppConfig;
use OCP\IURLGenerator;
use OCP\Settings\ISettings;

class Admin implements ISettings {
	public function __construct(
		private string $appName,
		private IAppConfig $appConfig,
		private IURLGenerator $urlGenerator,
	) {
	}

	public function getForm(): TemplateResponse {
		$defaultAccent = Accent::serverDefault(
			$this->appConfig->getValueString($this->appName, 'theme_default_accent', Accent::Plasma->value),
		);

		return new TemplateResponse('breezedark', 'admin', [
			'themeEnforced' => $this->appConfig->getValueString($this->appName, 'theme_enforced', '0') === '1',
			'themeLoginPage' => $this->appConfig->getValueString($this->appName, 'theme_login_page', '1') === '1',
			'themeAutomaticActivation' => $this->appConfig->getValueString($this->appName, 'theme_automatic_activation_enabled', '0') === '1',
			'themeCustomStyling' => $this->appConfig->getValueString($this->appName, 'theme_custom_styling', ''),
			'themeDefaultAccent' => $defaultAccent->value,
			'settingsUrl' => $this->urlGenerator->linkToRoute('breezedark.Settings.admin'),
			'customStylingUrl' => $this->urlGenerator->linkToRoute('breezedark.Settings.customStyling'),
		]);
	}

	public function getSection(): string {
		return 'theming';
	}

	public function getPriority(): int {
		return 50;
	}
}
