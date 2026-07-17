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

namespace OCA\BreezeDark\Controller;

use OCA\BreezeDark\Theme\Accent;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\Config\IUserConfig;
use OCP\IAppConfig;
use OCP\IConfig;
use OCP\IRequest;
use OCP\IUserSession;

class SettingsController extends Controller {
	private const MAX_CUSTOM_CSS_BYTES = 65535;

	private ?string $userId;

	public function __construct(
		string $appName,
		private IAppConfig $appConfig,
		private IUserConfig $userConfig,
		private IConfig $systemConfig,
		IUserSession $userSession,
		IRequest $request,
	) {
		parent::__construct($appName, $request);
		$this->userId = $userSession->getUser()?->getUID();
	}

	#[NoAdminRequired]
	public function personal(): DataResponse {
		if ($this->userId === null) {
			return new DataResponse(['status' => 'error', 'message' => 'Authentication required'], 401);
		}

		$currentAccent = $this->userConfig->getValueString(
			$this->userId,
			$this->appName,
			'theme_accent',
			Accent::USER_DEFAULT,
		);
		$accent = $this->request->getParam('theme_accent', $currentAccent);
		if (!Accent::isValidUserValue($accent)) {
			return new DataResponse(['status' => 'error', 'message' => 'Invalid theme accent'], 400);
		}

		$themeEnabled = $this->isEnabled('theme_enabled');
		$automaticActivation = $this->isEnabled('theme_automatic_activation_enabled');

		if ($this->appConfig->getValueString($this->appName, 'theme_enforced', '0') !== '1') {
			$this->userConfig->setValueString(
				$this->userId,
				$this->appName,
				'theme_enabled',
				$themeEnabled ? '1' : '0',
			);
		}

		$this->userConfig->setValueString(
			$this->userId,
			$this->appName,
			'theme_automatic_activation_enabled',
			$automaticActivation ? '1' : '0',
		);
		$this->userConfig->setValueString($this->userId, $this->appName, 'theme_accent', $accent);

		$serverAccent = $this->appConfig->getValueString(
			$this->appName,
			'theme_default_accent',
			Accent::Plasma->value,
		);

		return new DataResponse([
			'status' => 'ok',
			'accent' => Accent::resolve($accent, $serverAccent)->value,
		]);
	}

	public function admin(): DataResponse {
		$currentAccent = $this->appConfig->getValueString(
			$this->appName,
			'theme_default_accent',
			Accent::Plasma->value,
		);
		$accent = $this->request->getParam('theme_default_accent', $currentAccent);
		if (!is_string($accent) || Accent::tryFrom($accent) === null) {
			return new DataResponse(['status' => 'error', 'message' => 'Invalid theme accent'], 400);
		}

		$wasThemeEnforced = $this->appConfig->getValueString($this->appName, 'theme_enforced', '0') === '1';
		$themeEnforced = $this->isEnabled('theme_enforced');
		$this->appConfig->setValueString($this->appName, 'theme_enforced', $themeEnforced ? '1' : '0');
		$this->appConfig->setValueString(
			$this->appName,
			'theme_login_page',
			$this->isEnabled('theme_login_page') ? '1' : '0',
		);
		$this->appConfig->setValueString(
			$this->appName,
			'theme_automatic_activation_enabled',
			$this->isEnabled('theme_automatic_activation_enabled') ? '1' : '0',
		);
		$this->appConfig->setValueString($this->appName, 'theme_default_accent', $accent);
		$this->enforceTheme($themeEnforced, $wasThemeEnforced);

		return new DataResponse(['status' => 'ok', 'accent' => $accent]);
	}

	public function customStyling(): DataResponse {
		$customStyling = $this->request->getParam('theme_custom_styling', '');
		if (!is_string($customStyling)) {
			return new DataResponse(['status' => 'error', 'message' => 'Invalid CSS value'], 400);
		}
		if (strlen($customStyling) > self::MAX_CUSTOM_CSS_BYTES) {
			return new DataResponse(['status' => 'error', 'message' => 'Custom CSS is too large'], 413);
		}

		$this->appConfig->setValueString($this->appName, 'theme_custom_styling', $customStyling);
		$this->appConfig->setValueString(
			$this->appName,
			'theme_cachebuster',
			$customStyling === '' ? '0' : substr(hash('sha256', $customStyling), 0, 16),
		);

		return new DataResponse(['status' => 'ok']);
	}

	private function isEnabled(string $parameter): bool {
		return in_array($this->request->getParam($parameter), [1, '1', true, 'true', 'on'], true);
	}

	private function enforceTheme(bool $enabled, bool $wasEnabled): void {
		if ($enabled) {
			$this->systemConfig->setSystemValue('enforce_theme', 'dark');
			return;
		}

		if ($wasEnabled && $this->systemConfig->getSystemValueString('enforce_theme', '') === 'dark') {
			$this->systemConfig->setSystemValue('enforce_theme', '');
		}
	}
}
