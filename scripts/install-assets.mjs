import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const runtimeBuild = fileURLToPath(new URL("../build/vite-runtime/", import.meta.url));
const settingsBuild = fileURLToPath(new URL("../build/vite-settings/", import.meta.url));

mkdirSync(`${root}js`, { recursive: true });
mkdirSync(`${root}css`, { recursive: true });
rmSync(`${root}js/chunks`, { recursive: true, force: true });
rmSync(`${root}js/breezedark.js.map`, { force: true });
rmSync(`${root}js/settings.js.map`, { force: true });
cpSync(`${runtimeBuild}js/breezedark.js`, `${root}js/breezedark.js`);

// IIFE output is required because Nextcloud loads app scripts as classic scripts.
// Vite injects component CSS into that format; extract it to a CSP-safe stylesheet.
const settingsBundle = readFileSync(`${settingsBuild}js/settings.js`, "utf8");
const injectedStyle =
    /var ([\w$]+)=document\.createElement\("style"\);\1\.textContent=`([\s\S]*?)\/\*\$vite\$:1\*\/`,document\.head\.appendChild\(\1\);/;
const match = settingsBundle.match(injectedStyle);
if (!match) {
    throw new Error("Could not extract the settings stylesheet from the Vite IIFE bundle");
}
writeFileSync(`${root}js/settings.js`, settingsBundle.replace(injectedStyle, ""));
writeFileSync(`${root}css/settings.css`, match[2]);
