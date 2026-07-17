<?php

declare(strict_types=1);

/**
 * Breeze Next administration settings mount point.
 *
 * @copyright Copyright (C) 2026 inkcurity.net
 * @license GNU AGPL version 3 or any later version
 */

script('breezedark', 'settings');
style('breezedark', 'theme');
style('breezedark', 'settings');

$config = [
	'kind' => 'admin',
	'settingsUrl' => $settingsUrl,
	'customStylingUrl' => $customStylingUrl,
	'themeEnforced' => $themeEnforced,
	'themeAutomaticActivation' => $themeAutomaticActivation,
	'themeLoginPage' => $themeLoginPage,
	'themeDefaultAccent' => $themeDefaultAccent,
	'themeCustomStyling' => $themeCustomStyling,
	'labels' => [
		'title' => $l->t('Breeze Next'),
		'intro' => $l->t('A calm, modern Breeze-inspired dark theme for Nextcloud.'),
		'enforce' => $l->t('Enforce Breeze Next globally'),
		'enforceHint' => $l->t('Users keep their individual accent choice even when the theme is enforced.'),
		'automatic' => $l->t('Follow the client color scheme by default'),
		'login' => $l->t('Style login and public pages'),
		'accent' => $l->t('Server default accent'),
		'preview' => $l->t('Live preview'),
		'custom' => $l->t('Expert: Custom CSS'),
		'customHint' => $l->t('Custom CSS is loaded after Breeze Next and may override compatibility rules.'),
		'save' => $l->t('Save custom CSS'),
		'saved' => $l->t('Saved'),
		'error' => $l->t('Could not save the setting'),
		'plasma' => $l->t('Plasma'),
		'iris' => $l->t('Iris'),
		'coral' => $l->t('Coral'),
		'mint' => $l->t('Mint'),
		'honey' => $l->t('Honey'),
	],
];
?>

<div id="breeze-next-settings" data-config="<?php p(json_encode($config, JSON_THROW_ON_ERROR)); ?>"></div>
