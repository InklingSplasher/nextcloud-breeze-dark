<?php

declare(strict_types=1);

require_once __DIR__ . '/../../lib/Theme/Accent.php';

use OCA\BreezeDark\Theme\Accent;

$expectations = [
	Accent::serverDefault('invalid') === Accent::Plasma,
	Accent::resolve(Accent::USER_DEFAULT, Accent::Iris->value) === Accent::Iris,
	Accent::resolve(Accent::Mint->value, Accent::Iris->value) === Accent::Mint,
	Accent::isValidUserValue(Accent::USER_DEFAULT),
	!Accent::isValidUserValue('invalid'),
];

if (in_array(false, $expectations, true)) {
	throw new RuntimeException('Breeze Next accent enum validation failed');
}
