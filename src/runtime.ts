import { applyAccent } from "./accent";
import { synchronizeTheme } from "./automatic";

const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");

function meta(name: string, fallback: string): string {
    return document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.content ?? fallback;
}

function update(): void {
    if (!document.body) {
        return;
    }
    applyAccent(meta("breeze-next-accent", "plasma"));
    synchronizeTheme(
        document.body,
        meta("breeze-next-automatic", "0") === "1",
        colorScheme.matches,
    );
}

colorScheme.addEventListener("change", update);
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update, { once: true });
} else {
    update();
}
