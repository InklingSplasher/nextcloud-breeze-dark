import { createApp } from "vue";
import SettingsApp from "./SettingsApp.vue";

const mount = document.querySelector<HTMLElement>("#breeze-next-settings");
if (mount?.dataset.config) {
    const config: unknown = JSON.parse(mount.dataset.config);
    createApp(SettingsApp, { config }).mount(mount);
}
