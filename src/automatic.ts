function themeSet(target: HTMLElement): Set<string> {
    return new Set(
        (target.dataset.themes ?? "")
            .split(",")
            .map((theme) => theme.trim())
            .filter(Boolean),
    );
}

export function setThemeEnabled(target: HTMLElement, themeId: string, enabled: boolean): void {
    const themes = themeSet(target);
    if (enabled) {
        target.setAttribute(`data-theme-${themeId}`, "");
        themes.add(themeId);
    } else {
        target.removeAttribute(`data-theme-${themeId}`);
        themes.delete(themeId);
    }
    target.dataset.themes = [...themes].join(",");
}

export function synchronizeTheme(
    target: HTMLElement,
    automatic: boolean,
    prefersDark: boolean,
): boolean {
    const enabled = !automatic || prefersDark;
    target.dataset.breezeMode = automatic ? "automatic" : "dark";
    target.classList.toggle("theme--breezedark", enabled);
    target.classList.toggle("theme--dark", enabled);
    setThemeEnabled(target, "breezedark", enabled);
    setThemeEnabled(target, "dark", enabled);
    return enabled;
}
