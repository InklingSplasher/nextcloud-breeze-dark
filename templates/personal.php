<?php
/**
 * InkCurity Dark theme for Nextcloud — personal settings, a Trumpf hub
 *
 * @copyright Copyright (C) 2020  Magnus Walbeck <mw@mwalbeck.org>
 * @copyright Copyright (C) 2026 inkcurity.net
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

script('breezedark', 'trumpf-ui');
script('breezedark', 'settings-personal');
style('breezedark', 'settings');
require __DIR__ . '/_icons.php';
?>

<div
    id="breezedark"
    class="breezedark-personal section tr-hub"
    data-settings-url="<?php p($settingsUrl); ?>"
    data-saved-label="<?php p($l->t('Saved')); ?>"
    data-error-label="<?php p($l->t('Error')); ?>"
    data-enabled-label="<?php p($l->t('InkCurity Dark is on')); ?>"
    data-reload-label="<?php p($l->t('Reload')); ?>"
>
    <div class="tr-hero">
        <span class="tr-hero__mark tr-hero__mark--a" aria-hidden="true">▌//</span>
        <span class="tr-hero__mark tr-hero__mark--b" aria-hidden="true">█▮</span>
        <div class="tr-hero__head">
            <img class="tr-hero__icon" src="<?php p($appWebPath); ?>/img/inkcurity-logo.svg" alt="" width="52" height="52">
            <div class="tr-hero__titles">
                <h2 class="tr-hero__title"><?php p($l->t('InkCurity Dark')); ?></h2>
                <p class="tr-hero__subtitle">v<?php p($appVersion); ?> · <?php p($l->t('Ink. Privacy. Craft.')); ?></p>
            </div>
        </div>
        <label class="tr-hero__row" for="breezedark-enabled">
            <span class="tr-hero__disc"><?php print_unescaped($breezedarkIcon('moon')); ?></span>
            <span class="tr-hero__who">
                <span class="tr-hero__name"><?php p($l->t('Enable InkCurity Dark theme')); ?></span>
                <span class="tr-hero__handle">
                    <?php if ($themeEnforced) : ?>
                        <?php p($l->t('Enforced for everyone by your administrator')); ?>
                    <?php else : ?>
                        <?php p($l->t('Dusk blue, an accent per app, calm surfaces')); ?>
                    <?php endif; ?>
                </span>
            </span>
            <?php if ($themeEnforced) : ?>
                <input type="checkbox" role="switch" class="tr-switch tr-switch--glass" id="breezedark-enabled" disabled checked>
            <?php else : ?>
                <input type="checkbox" role="switch" class="tr-switch tr-switch--glass" id="breezedark-enabled" <?php p($themeEnabled ? 'checked' : ''); ?>>
            <?php endif; ?>
        </label>
    </div>

    <h3 class="tr-section__title"><?php p($l->t('Appearance')); ?></h3>
    <ul class="tr-section__group">
        <li>
            <label class="tr-row" for="breezedark-automatic-activation-enabled">
                <span class="tr-tile"><?php print_unescaped($breezedarkIcon('monitor')); ?></span>
                <span class="tr-row__text">
                    <span class="tr-row__title"><?php p($l->t('Follow the system setting')); ?></span>
                    <span class="tr-row__subtitle"><?php p($l->t('Dark only while your device is set to dark')); ?></span>
                </span>
                <input type="checkbox" role="switch" class="tr-switch" id="breezedark-automatic-activation-enabled" <?php p($themeAutomaticActivation ? 'checked' : ''); ?>>
            </label>
        </li>
    </ul>
    <p class="tr-section__foot"><?php p($l->t('Changes apply after a reload.')); ?></p>

    <h3 class="tr-section__title"><?php p($l->t('Preview')); ?></h3>
    <div class="tr-preview">
        <img class="tr-preview__card" src="<?php p($appWebPath); ?>/img/theme-inkcurity.jpg" alt="<?php p($l->t('Preview of the InkCurity Dark theme')); ?>" loading="lazy">
    </div>

    <p class="tr-signature">InkCurity Dark · v<?php p($appVersion); ?></p>
</div>
