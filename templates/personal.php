<?php

declare(strict_types=1);

/**
 * Breeze Next personal settings mount point.
 *
 * @copyright Copyright (C) 2026 inkcurity.net
 * @license GNU AGPL version 3 or any later version
 */

script('breezedark', 'settings');
style('breezedark', 'theme');
style('breezedark', 'settings');

$config = [
	'kind' => 'personal',
	'settingsUrl' => $settingsUrl,
	'themeEnforced' => $themeEnforced,
	'themeEnabled' => $themeEnabled,
	'themeAutomaticActivation' => $themeAutomaticActivation,
	'themeAccent' => $themeAccent,
	'themeDefaultAccent' => $themeDefaultAccent,
	'resolvedAccent' => $resolvedAccent,
	'labels' => [
		'title' => $l->t('Breeze Next'),
		'intro' => $l->t('A calm, modern Breeze-inspired dark theme for Nextcloud.'),
		'enabled' => $l->t('Enable Breeze Next'),
		'enforced' => $l->t('Breeze Next is enforced by the administrator.'),
		'automatic' => $l->t('Follow my device color scheme'),
		'accent' => $l->t('Accent color'),
		'preview' => $l->t('Live preview'),
		'saved' => $l->t('Saved'),
		'error' => $l->t('Could not save the setting'),
		'serverDefault' => $l->t('Server default'),
		'plasma' => $l->t('Plasma'),
		'iris' => $l->t('Iris'),
		'coral' => $l->t('Coral'),
		'mint' => $l->t('Mint'),
		'honey' => $l->t('Honey'),
	],
];
?>

<div id="breeze-next-settings" data-config="<?php p(json_encode($config, JSON_THROW_ON_ERROR)); ?>"></div>
