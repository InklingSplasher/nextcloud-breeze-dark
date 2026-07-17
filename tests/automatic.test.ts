import { beforeEach, describe, expect, it } from "vitest";
import { setThemeEnabled, synchronizeTheme } from "../src/automatic";

describe("automatic theme synchronization", () => {
    beforeEach(() => {
        document.body.className = "theme--other";
        document.body.dataset.themes = "other,contrast";
    });

    it("enables Breeze in fixed mode while preserving other themes", () => {
        expect(synchronizeTheme(document.body, false, false)).toBe(true);
        expect(document.body.dataset.themes).toContain("other");
        expect(document.body.dataset.themes).toContain("contrast");
        expect(document.body.dataset.themes).toContain("breezedark");
    });

    it("follows dark preference in automatic mode", () => {
        expect(synchronizeTheme(document.body, true, false)).toBe(false);
        expect(document.body.dataset.themes).toBe("other,contrast");
        expect(synchronizeTheme(document.body, true, true)).toBe(true);
        expect(document.body.hasAttribute("data-theme-breezedark")).toBe(true);
    });

    it("changes only the requested theme flag", () => {
        setThemeEnabled(document.body, "breezedark", true);
        setThemeEnabled(document.body, "breezedark", false);
        expect(document.body.dataset.themes).toBe("other,contrast");
    });
});
