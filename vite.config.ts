import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
    const runtime = mode === "runtime";

    return {
        plugins: [vue()],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        build: {
            outDir: runtime ? "build/vite-runtime" : "build/vite-settings",
            emptyOutDir: true,
            sourcemap: false,
            target: "es2022",
            cssCodeSplit: true,
            rollupOptions: {
                input: fileURLToPath(
                    new URL(runtime ? "./src/runtime.ts" : "./src/settings.ts", import.meta.url),
                ),
                output: {
                    name: runtime ? "BreezeNextRuntime" : "BreezeNextSettings",
                    format: "iife",
                    inlineDynamicImports: true,
                    entryFileNames: runtime ? "js/breezedark.js" : "js/settings.js",
                    assetFileNames: (assetInfo) =>
                        assetInfo.names.some((name) => name.endsWith(".css"))
                            ? "css/settings.css"
                            : "js/assets/[name]-[hash][extname]",
                },
            },
        },
        test: {
            environment: "jsdom",
            include: ["tests/**/*.test.ts"],
        },
    };
});
