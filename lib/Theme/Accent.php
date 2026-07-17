<?php

declare(strict_types=1);

/**
 * Breeze Next accent palette.
 *
 * @copyright Copyright (C) 2026 inkcurity.net
 * @license GNU AGPL version 3 or any later version
 */

namespace OCA\BreezeDark\Theme;

enum Accent: string {
	case Plasma = 'plasma';
	case Iris = 'iris';
	case Coral = 'coral';
	case Mint = 'mint';
	case Honey = 'honey';

	public const USER_DEFAULT = 'default';

	public static function serverDefault(string $value): self {
		return self::tryFrom($value) ?? self::Plasma;
	}

	public static function resolve(string $userValue, string $serverValue): self {
		if ($userValue === self::USER_DEFAULT) {
			return self::serverDefault($serverValue);
		}

		return self::tryFrom($userValue) ?? self::serverDefault($serverValue);
	}

	public static function isValidUserValue(mixed $value): bool {
		return is_string($value)
			&& ($value === self::USER_DEFAULT || self::tryFrom($value) !== null);
	}
}
