import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const palette = readFileSync(resolve("css/tokens/_palette.scss"), "utf8");
const guest = readFileSync(resolve("css/layouts/_guest.scss"), "utf8");
const shell = readFileSync(resolve("css/layouts/_shell.scss"), "utf8");
const overlays = readFileSync(resolve("css/components/_overlays.scss"), "utf8");
const notifications = readFileSync(resolve("css/adapters/_notifications.scss"), "utf8");

describe("NC34 style regressions", () => {
    it("keeps theme tokens specific enough to beat the core dark palette", () => {
        expect(palette).toContain("body[data-theme-breezedark]");
        expect(palette).toContain("body.theme--breezedark");
        expect(palette).not.toMatch(/:where\([^)]*theme--breezedark[^)]*\)\s*\{/);
    });

    it("does not style the guest logo container as the application header", () => {
        expect(shell).toContain("#header:not(.header-guest)");
        expect(guest).toContain("#header.header-guest");
    });

    it("uses one NC34 login card and keeps the footer outside it", () => {
        expect(guest).toContain(".guest-box.login-box");
        expect(guest).toContain(".body-login-container");
        expect(guest).toContain(".login-box__alternative-logins:not(:empty)");
        expect(guest).not.toContain("body#body-login .login-form,");
        expect(guest).toContain("> footer.guest-box");
    });

    it("keeps every accent example scoped to its own swatch", () => {
        for (const accent of ["plasma", "iris", "coral", "mint", "honey"]) {
            expect(palette).toContain(`.breeze-next-settings [data-breeze-accent="${accent}"]`);
        }
    });

    it("keeps context menus and notifications on the main Breeze gray", () => {
        expect(overlays).toContain("background: var(--breeze-surface);");
        expect(notifications).toContain("#notifications .header-menu__wrapper");
        expect(notifications).toContain("background: var(--breeze-surface);");
        expect(notifications).toContain("background: transparent;");
        expect(notifications).not.toContain("var(--breeze-surface-popover)");
    });
});
