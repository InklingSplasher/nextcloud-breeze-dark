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

/* Browser bars ------------------------------------------------------------
 * Nextcloud announces its primary colour as theme-color, which tints the
 * address bar and toolbars of mobile browsers. While the theme is on, they
 * take the ink of the page; when it is off, Nextcloud's colour returns.
 */
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const nextcloudThemeColor = themeColorMeta?.getAttribute("content") ?? null;

function syncThemeColor() {
    if (!themeColorMeta || !document.body) {
        return;
    }
    const ink = getComputedStyle(document.body).getPropertyValue("--ic-void").trim();
    const color = ink || nextcloudThemeColor;
    if (color) {
        themeColorMeta.setAttribute("content", color);
    }
}

function updateTheme() {
    updateColorScheme();
    syncThemeColor();
}

cssMediaDark.addEventListener("change", updateTheme);
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateTheme, { once: true });
} else {
    updateTheme();
}

/* Dashboard eyebrow ---------------------------------------------------------
 * Above the large title of the start page sits today's date as a mono tag,
 * in the user's language: "DONNERSTAG · 22. OKTOBER". The stylesheet shows it
 * from data-ic-eyebrow.
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
    title.dataset.icEyebrow = label.replace(/,\s*/, " · ");
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

/* The scan ---------------------------------------------------------------------
 * One sweep of light along the top edge of the panel when a page has loaded,
 * like the scan line under the InkCurity nav. It runs once and then rests;
 * reduced motion hides it in the stylesheet.
 */
function scanOnce() {
    const body = document.body;
    if (!body || !["body-user", "body-settings"].includes(body.id)) {
        return;
    }
    window.requestAnimationFrame(() => {
        body.classList.add("ic-scan");
        window.setTimeout(() => body.classList.remove("ic-scan"), 2000);
    });
}

if (document.readyState === "complete") {
    scanOnce();
} else {
    window.addEventListener("load", scanOnce, { once: true });
}

/* Easter egg ------------------------------------------------------------------
 * The InkCurity design system hides an ink splash behind the Konami code, and
 * so does the theme: ink in the blues of the theme all over the page, and the
 * tagline. With reduced motion only the toast appears.
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
    ui?.burst(16);
    ui?.showToast({ message: "▌ Ink. Privacy. Craft." });
});
