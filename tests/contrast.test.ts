import { describe, expect, it } from "vitest";

const accents = {
    plasma: "#3DAEE9",
    iris: "#A78BFA",
    coral: "#FF7A90",
    mint: "#55D6A8",
    honey: "#F6C453",
};

function luminance(hex: string): number {
    const channels = hex
        .slice(1)
        .match(/.{2}/g)!
        .map((channel) => Number.parseInt(channel, 16) / 255)
        .map((channel) =>
            channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
        );
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground: string, background: string): number {
    const lighter = Math.max(luminance(foreground), luminance(background));
    const darker = Math.min(luminance(foreground), luminance(background));
    return (lighter + 0.05) / (darker + 0.05);
}

describe("filled accent contrast", () => {
    it.each(Object.entries(accents))("%s meets WCAG AA", (_name, value) => {
        expect(contrast(value, "#111820")).toBeGreaterThanOrEqual(4.5);
    });
});
