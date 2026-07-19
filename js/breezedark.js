/**
 * Breeze Dark theme for Nextcloud
 *
 * @copyright Copyright (C) 2021  Magnus Walbeck <mw@mwalbeck.org>
 *
 * @author Magnus Walbeck <mw@mwalbeck.org>
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

const cssMediaDark = window.matchMedia("(prefers-color-scheme: dark)");

function setThemeEnabled(body, themeId, enabled) {
    const enabledThemes = new Set(
        (body.dataset.themes ?? "")
            .split(",")
            .map((theme) => theme.trim())
            .filter(Boolean),
    );

    if (enabled) {
        body.setAttribute(`data-theme-${themeId}`, "");
        enabledThemes.add(themeId);
    } else {
        body.removeAttribute(`data-theme-${themeId}`);
        enabledThemes.delete(themeId);
    }

    body.dataset.themes = Array.from(enabledThemes).join(",");
}

function updateColorScheme() {
    const body = document.body;
    if (!body) {
        return;
    }

    const automaticActivationEnabled =
        getComputedStyle(body)
            .getPropertyValue("--breezedark-automatic-activation-enabled")
            .trim() === "1";
    const darkEnabled = !automaticActivationEnabled || cssMediaDark.matches;

    body.classList.toggle("theme--dark", darkEnabled);
    body.classList.toggle("theme--breezedark", darkEnabled);
    body.classList.toggle("theme--light", !darkEnabled);
    setThemeEnabled(body, "dark", darkEnabled);
    setThemeEnabled(body, "breezedark", darkEnabled);
}

cssMediaDark.addEventListener("change", updateColorScheme);
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateColorScheme, { once: true });
} else {
    updateColorScheme();
}
