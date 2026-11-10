<?php
/**
 * InkCurity Dark theme for Nextcloud — personal settings
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
    class="breezedark-personal section ic-hub"
    data-settings-url="<?php p($settingsUrl); ?>"
    data-saved-label="<?php p($l->t('Saved')); ?>"
    data-error-label="<?php p($l->t('Error')); ?>"
    data-enabled-label="<?php p($l->t('InkCurity Dark is on')); ?>"
    data-reload-label="<?php p($l->t('Reload')); ?>"
>
    <div class="ic-hero">
        <div class="ic-hero__head">
            <img class="ic-hero__mark" src="<?php p($appWebPath); ?>/img/inkcurity-logo.svg" alt="" width="52" height="52">
            <div class="ic-hero__titles">
                <h2 class="ic-hero__title"><?php p($l->t('InkCurity Dark')); ?><span class="ic-hero__cursor" aria-hidden="true">▌</span></h2>
                <p class="ic-hero__meta">v<?php p($appVersion); ?> · ink · privacy · craft</p>
            </div>
        </div>
        <p class="ic-hero__bars" aria-hidden="true"><span>████</span> <span>██</span> <span>███████</span> <span>█</span> <span>█████</span></p>
        <label class="ic-hero__row" for="breezedark-enabled">
            <span class="ic-tile ic-tile--lit"><?php print_unescaped($breezedarkIcon('moon')); ?></span>
            <span class="ic-row__text">
                <span class="ic-row__title"><?php p($l->t('Enable InkCurity Dark theme')); ?></span>
                <span class="ic-row__subtitle">
                    <?php if ($themeEnforced) : ?>
                        <?php p($l->t('Enforced for everyone by your administrator')); ?>
                    <?php else : ?>
                        <?php p($l->t('Deep ink blue, one splash of light, calm surfaces')); ?>
                    <?php endif; ?>
                </span>
            </span>
            <?php if ($themeEnforced) : ?>
                <input type="checkbox" role="switch" class="ic-switch" id="breezedark-enabled" disabled checked>
            <?php else : ?>
                <input type="checkbox" role="switch" class="ic-switch" id="breezedark-enabled" <?php p($themeEnabled ? 'checked' : ''); ?>>
            <?php endif; ?>
        </label>
    </div>

    <h3 class="ic-section__title"><?php p($l->t('Appearance')); ?></h3>
    <ul class="ic-section__group">
        <li>
            <label class="ic-row" for="breezedark-automatic-activation-enabled">
                <span class="ic-tile"><?php print_unescaped($breezedarkIcon('monitor')); ?></span>
                <span class="ic-row__text">
                    <span class="ic-row__title"><?php p($l->t('Follow the system setting')); ?></span>
                    <span class="ic-row__subtitle"><?php p($l->t('Dark only while your device is set to dark')); ?></span>
                </span>
                <input type="checkbox" role="switch" class="ic-switch" id="breezedark-automatic-activation-enabled" <?php p($themeAutomaticActivation ? 'checked' : ''); ?>>
            </label>
        </li>
    </ul>
    <p class="ic-section__foot"><?php p($l->t('Changes apply after a reload.')); ?></p>

    <h3 class="ic-section__title"><?php p($l->t('Preview')); ?></h3>
    <figure class="ic-preview">
        <img class="ic-preview__shot" src="<?php p($appWebPath); ?>/img/theme-inkcurity.jpg" alt="<?php p($l->t('Preview of the InkCurity Dark theme')); ?>" loading="lazy">
    </figure>

    <p class="ic-signature">InkCurity Dark · v<?php p($appVersion); ?></p>
</div>
