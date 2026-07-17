import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { compile } from "sass";

const runtime = readFileSync(new URL("../js/breezedark.js", import.meta.url));
const expandedTheme = compile(fileURLToPath(new URL("../css/theme.scss", import.meta.url))).css;
const limits = {
    theme: 75 * 1024,
    runtimeGzip: 5 * 1024,
};
const runtimeGzip = gzipSync(runtime).byteLength;

const expandedThemeBytes = Buffer.byteLength(expandedTheme);
if (expandedThemeBytes >= limits.theme) {
    throw new Error(`Expanded theme CSS is ${expandedThemeBytes} bytes; limit is ${limits.theme}`);
}
if (runtimeGzip >= limits.runtimeGzip) {
    throw new Error(`Runtime gzip is ${runtimeGzip} bytes; limit is ${limits.runtimeGzip}`);
}

console.log(`expanded theme ${expandedThemeBytes} bytes; runtime gzip ${runtimeGzip} bytes`);
