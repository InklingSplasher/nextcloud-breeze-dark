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

/* Dashboard eyebrow ---------------------------------------------------------
 * Trumpf puts the context above the large title of a start page: today's
 * date, in the user's language. The stylesheet shows it from data-tr-eyebrow.
 */
function setDashboardEyebrow() {
    const title = document.querySelector("#app-dashboard > h2");
    if (!(title instanceof HTMLElement)) {
        return false;
    }

    const lang = document.documentElement.lang || undefined;
    let label = "";
    try {
        label = new Intl.DateTimeFormat(lang, {
            weekday: "long",
            day: "numeric",
            month: "long",
        }).format(new Date());
    } catch {
        label = new Date().toDateString();
    }
    title.dataset.trEyebrow = label;
    return true;
}

function watchDashboardEyebrow() {
    if (!document.body || document.body.id !== "body-user") {
        return;
    }
    if (setDashboardEyebrow()) {
        return;
    }

    // The dashboard renders after load; watch briefly, then let go.
    const observer = new MutationObserver(() => {
        if (setDashboardEyebrow()) {
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 10000);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchDashboardEyebrow, { once: true });
} else {
    watchDashboardEyebrow();
}

/* Easter egg ------------------------------------------------------------------
 * The InkCurity design system ships an ink-splash easter egg behind the Konami
 * code. Here the same code throws confetti in the colours of the apps and
 * shows the tagline. Nothing happens with reduced motion except the toast.
 */
const KONAMI = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];
let konamiPosition = 0;

document.addEventListener("keydown", (event) => {
    const target = event.target;
    if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
    ) {
        konamiPosition = 0;
        return;
    }

    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    konamiPosition =
        key === KONAMI[konamiPosition] ? konamiPosition + 1 : key === KONAMI[0] ? 1 : 0;
    if (konamiPosition < KONAMI.length) {
        return;
    }

    konamiPosition = 0;
    const ui = window.BreezeDarkUI;
    ui?.confetti([
        "#336deb",
        "#ec4899",
        "#ff7158",
        "#5bd49a",
        "#7bd6eb",
        "#f0c25e",
        "#d48ad9",
        "#ffffff",
    ]);
    ui?.showToast({ message: "▌ Ink. Privacy. Craft." });
});
