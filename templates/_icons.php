<?php
/**
 * InkCurity Dark — line icons for the settings hub (Lucide geometry, 24 grid,
 * round caps). Decorative: every icon sits next to a text label.
 *
 * @copyright Copyright (C) 2026 inkcurity.net
 *
 * @license GNU AGPL version 3 or any later version
 */

$breezedarkIcon = static function (string $name): string {
	$paths = [
		'moon' => '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
		'monitor' => '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
		'users' => '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
		'log-in' => '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>',
		'code' => '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
		'sparkles' => '<path d="M12 3 13.9 8.1 19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 15v4"/><path d="M17 17h4"/>',
	];

	return '<svg class="ic-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" '
		. 'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
		. ($paths[$name] ?? '') . '</svg>';
};
