import { describe, expect, it } from "vitest";
import { isAccent, isUserAccent, resolveAccent } from "../src/accent";

describe("accent validation and inheritance", () => {
    it.each(["plasma", "iris", "coral", "mint", "honey"])("accepts %s", (accent) => {
        expect(isAccent(accent)).toBe(true);
        expect(isUserAccent(accent)).toBe(true);
    });

    it("accepts default only for users", () => {
        expect(isAccent("default")).toBe(false);
        expect(isUserAccent("default")).toBe(true);
    });

    it("resolves server default and rejects unknown values", () => {
        expect(resolveAccent("default", "iris")).toBe("iris");
        expect(resolveAccent("mint", "iris")).toBe("mint");
        expect(resolveAccent("invalid", "coral")).toBe("coral");
        expect(resolveAccent("default", "invalid")).toBe("plasma");
    });
});
