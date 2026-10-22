<?php
/**
 * InkCurity Dark theme for Nextcloud — admin settings, a Trumpf hub
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
script('breezedark', 'settings-admin');
style('breezedark', 'settings');
require __DIR__ . '/_icons.php';
?>

<div
    id="breezedark"
    class="breezedark-admin section tr-hub"
    data-settings-url="<?php p($settingsUrl); ?>"
    data-custom-styling-url="<?php p($customStylingUrl); ?>"
    data-saved-label="<?php p($l->t('Saved')); ?>"
    data-error-label="<?php p($l->t('Error')); ?>"
    data-enabled-label="<?php p($l->t('InkCurity Dark is on for everyone')); ?>"
    data-reload-label="<?php p($l->t('Reload')); ?>"
>
    <div class="tr-hero">
        <span class="tr-hero__mark tr-hero__mark--a" aria-hidden="true">▌//</span>
        <span class="tr-hero__mark tr-hero__mark--b" aria-hidden="true">█▮</span>
        <div class="tr-hero__head">
            <img class="tr-hero__icon" src="<?php p($appWebPath); ?>/img/inkcurity-logo.svg" alt="" width="52" height="52">
            <div class="tr-hero__titles">
                <h2 class="tr-hero__title"><?php p($l->t('InkCurity Dark')); ?></h2>
                <p class="tr-hero__subtitle">v<?php p($appVersion); ?> · <?php p($l->t('Based on Breeze Dark')); ?></p>
            </div>
        </div>
        <label class="tr-hero__row" for="breezedark-theme-enabled">
            <span class="tr-hero__disc"><?php print_unescaped($breezedarkIcon('users')); ?></span>
            <span class="tr-hero__who">
                <span class="tr-hero__name"><?php p($l->t('Enforce InkCurity Dark theme use globally')); ?></span>
                <span class="tr-hero__handle"><?php p($l->t('Everyone sees the theme and cannot switch it off')); ?></span>
            </span>
            <input type="checkbox" role="switch" class="tr-switch tr-switch--glass" id="breezedark-theme-enabled" <?php p($themeEnforced ? 'checked' : ''); ?>>
        </label>
    </div>

    <h3 class="tr-section__title"><?php p($l->t('Activation')); ?></h3>
    <ul class="tr-section__group">
        <li>
            <label class="tr-row" for="breezedark-automatic-activation-enabled">
                <span class="tr-tile"><?php print_unescaped($breezedarkIcon('monitor')); ?></span>
                <span class="tr-row__text">
                    <span class="tr-row__title"><?php p($l->t('Follow the system setting by default')); ?></span>
                    <span class="tr-row__subtitle" data-tr-when-locked="<?php p($l->t('Needs the theme enforced for everyone')); ?>" data-tr-when-open="<?php p($l->t('For guests and users without a preference')); ?>">
                        <?php p($themeEnforced ? $l->t('For guests and users without a preference') : $l->t('Needs the theme enforced for everyone')); ?>
                    </span>
                </span>
                <input type="checkbox" role="switch" class="tr-switch" id="breezedark-automatic-activation-enabled" <?php p($themeEnforced ? '' : 'disabled');?> <?php p($themeAutomaticActivation ? 'checked' : ''); ?>>
            </label>
        </li>
        <li>
            <label class="tr-row" for="breezedark-theme-login-page">
                <span class="tr-tile"><?php print_unescaped($breezedarkIcon('log-in')); ?></span>
                <span class="tr-row__text">
                    <span class="tr-row__title"><?php p($l->t('Enable InkCurity Dark theme for the login page')); ?></span>
                    <span class="tr-row__subtitle"><?php p($l->t('When enforced, or while a user with the theme logs in')); ?></span>
                </span>
                <input type="checkbox" role="switch" class="tr-switch" id="breezedark-theme-login-page" <?php p($themeLoginPage ? 'checked' : ''); ?>>
            </label>
        </li>
    </ul>
    <p class="tr-section__foot"><?php p($l->t('Changes apply after a reload.')); ?></p>

    <h3 class="tr-section__title"><?php p($l->t('Custom Styling')); ?></h3>
    <div class="tr-section__group tr-section__group--padded">
        <label class="tr-field-label" for="breezedark-theme-custom-styling">
            <span class="tr-tile"><?php print_unescaped($breezedarkIcon('code')); ?></span>
            <span><?php p($l->t('Plain CSS, applied whenever the theme is on')); ?></span>
        </label>
        <textarea id="breezedark-theme-custom-styling" class="breezedark-custom-styling" spellcheck="false" placeholder="<?php p($l->t('Insert custom styling here …')); ?>"><?php p($themeCustomStyling); ?></textarea>
        <div class="tr-actions">
            <button type="button" class="tr-button tr-button--filled" id="breezedark-theme-custom-styling-button"><?php p($l->t('Save')); ?></button>
        </div>
    </div>

    <p class="tr-signature">InkCurity Dark · v<?php p($appVersion); ?></p>
</div>
