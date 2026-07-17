<script setup lang="ts">
import NcButton from "@nextcloud/vue/components/NcButton";
import NcCheckboxRadioSwitch from "@nextcloud/vue/components/NcCheckboxRadioSwitch";
import { computed, ref } from "vue";
import { ACCENTS, applyAccent, isAccent, isUserAccent, resolveAccent } from "./accent";
import type { Accent, UserAccent } from "./accent";
import { postSettings } from "./settings-api";

interface SettingsConfig {
    kind: "admin" | "personal";
    settingsUrl: string;
    customStylingUrl?: string;
    themeEnforced: boolean;
    themeEnabled?: boolean;
    themeAutomaticActivation: boolean;
    themeLoginPage?: boolean;
    themeDefaultAccent: Accent;
    themeAccent?: UserAccent;
    resolvedAccent?: Accent;
    themeCustomStyling?: string;
    labels: Record<string, string>;
}

const props = defineProps<{ config: SettingsConfig }>();
const config = props.config;
const enforced = ref(config.themeEnforced);
const enabled = ref(config.themeEnabled ?? config.themeEnforced);
const automatic = ref(config.themeAutomaticActivation);
const login = ref(config.themeLoginPage ?? true);
const defaultAccent = ref<Accent>(
    isAccent(config.themeDefaultAccent) ? config.themeDefaultAccent : "plasma",
);
const userAccent = ref<UserAccent>(
    isUserAccent(config.themeAccent) ? config.themeAccent : "default",
);
const customCss = ref(config.themeCustomStyling ?? "");
const status = ref<"idle" | "saving" | "saved" | "error">("idle");
let saveQueue = Promise.resolve();

const isAdmin = computed(() => config.kind === "admin");
const selectedAccent = computed<Accent>(() =>
    isAdmin.value ? defaultAccent.value : resolveAccent(userAccent.value, defaultAccent.value),
);
const accentChoices = computed(() =>
    isAdmin.value ? ACCENTS : (["default", ...ACCENTS] as const),
);

function label(key: string): string {
    return config.labels[key] ?? key;
}

function settingsPayload(): Record<string, string> {
    if (isAdmin.value) {
        return {
            theme_enforced: enforced.value ? "1" : "0",
            theme_automatic_activation_enabled: automatic.value ? "1" : "0",
            theme_login_page: login.value ? "1" : "0",
            theme_default_accent: defaultAccent.value,
        };
    }
    return {
        theme_enabled: enabled.value ? "1" : "0",
        theme_automatic_activation_enabled: automatic.value ? "1" : "0",
        theme_accent: userAccent.value,
    };
}

function save(): void {
    status.value = "saving";
    saveQueue = saveQueue
        .catch(() => undefined)
        .then(async () => {
            const response = await postSettings(config.settingsUrl, settingsPayload());
            applyAccent(response.accent ?? selectedAccent.value);
            status.value = "saved";
            window.setTimeout(() => {
                if (status.value === "saved") status.value = "idle";
            }, 3000);
        })
        .catch(() => {
            status.value = "error";
        });
}

function chooseAccent(value: string): void {
    if (isAdmin.value && isAccent(value)) {
        defaultAccent.value = value;
    } else if (!isAdmin.value && isUserAccent(value)) {
        userAccent.value = value;
    }
    save();
}

async function saveCustomCss(): Promise<void> {
    if (!config.customStylingUrl) return;
    status.value = "saving";
    try {
        await postSettings(config.customStylingUrl, { theme_custom_styling: customCss.value });
        status.value = "saved";
    } catch {
        status.value = "error";
    }
}
</script>

<template>
    <section class="breeze-next-settings section" :data-breeze-accent="selectedAccent">
        <header class="breeze-next-settings__header">
            <div>
                <h2>{{ label("title") }}</h2>
                <p>{{ label("intro") }}</p>
            </div>
            <span class="breeze-next-settings__version">34.1</span>
        </header>

        <div class="breeze-next-settings__grid">
            <div class="breeze-next-settings__controls">
                <template v-if="isAdmin">
                    <NcCheckboxRadioSwitch
                        v-model="enforced"
                        type="switch"
                        @update:model-value="save"
                    >
                        {{ label("enforce") }}
                    </NcCheckboxRadioSwitch>
                    <p class="breeze-next-settings__hint">{{ label("enforceHint") }}</p>
                    <NcCheckboxRadioSwitch
                        v-model="automatic"
                        type="switch"
                        :disabled="!enforced"
                        @update:model-value="save"
                    >
                        {{ label("automatic") }}
                    </NcCheckboxRadioSwitch>
                    <NcCheckboxRadioSwitch v-model="login" type="switch" @update:model-value="save">
                        {{ label("login") }}
                    </NcCheckboxRadioSwitch>
                </template>
                <template v-else>
                    <NcCheckboxRadioSwitch
                        v-model="enabled"
                        type="switch"
                        :disabled="enforced"
                        @update:model-value="save"
                    >
                        {{ label("enabled") }}
                    </NcCheckboxRadioSwitch>
                    <p v-if="enforced" class="breeze-next-settings__hint">
                        {{ label("enforced") }}
                    </p>
                    <NcCheckboxRadioSwitch
                        v-model="automatic"
                        type="switch"
                        @update:model-value="save"
                    >
                        {{ label("automatic") }}
                    </NcCheckboxRadioSwitch>
                </template>

                <fieldset class="breeze-next-accents">
                    <legend>{{ label("accent") }}</legend>
                    <label
                        v-for="accent in accentChoices"
                        :key="accent"
                        class="breeze-next-accents__choice"
                        :data-breeze-accent="accent === 'default' ? defaultAccent : accent"
                    >
                        <input
                            type="radio"
                            name="breeze-next-accent"
                            :value="accent"
                            :checked="isAdmin ? defaultAccent === accent : userAccent === accent"
                            @change="chooseAccent(accent)"
                        />
                        <span class="breeze-next-accents__swatch" aria-hidden="true"></span>
                        <span>{{ label(accent === "default" ? "serverDefault" : accent) }}</span>
                    </label>
                </fieldset>
            </div>

            <div class="breeze-next-preview" :data-breeze-accent="selectedAccent">
                <h3>{{ label("preview") }}</h3>
                <div class="breeze-next-preview__window">
                    <nav>
                        <span class="active">Files</span>
                        <span>Photos</span>
                    </nav>
                    <main>
                        <div class="breeze-next-preview__row selected">Quarterly notes</div>
                        <div class="breeze-next-preview__row">Project images</div>
                        <button type="button">Create</button>
                    </main>
                </div>
            </div>
        </div>

        <details v-if="isAdmin" class="breeze-next-expert">
            <summary>{{ label("custom") }}</summary>
            <p>{{ label("customHint") }}</p>
            <textarea v-model="customCss" spellcheck="false"></textarea>
            <NcButton variant="primary" @click="saveCustomCss">{{ label("save") }}</NcButton>
        </details>

        <p class="breeze-next-settings__status" role="status" aria-live="polite">
            <span v-if="status === 'saved'">{{ label("saved") }}</span>
            <span v-else-if="status === 'error'">{{ label("error") }}</span>
        </p>
    </section>
</template>

<style lang="scss">
.breeze-next-settings {
    max-inline-size: 1040px;
    padding: var(--breeze-space-6);
    border: 1px solid var(--breeze-border);
    border-radius: var(--breeze-radius-container);
    background: var(--breeze-surface);
    color: var(--breeze-text);

    &__header {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: var(--breeze-space-4);
        margin-block-end: var(--breeze-space-6);

        p {
            color: var(--breeze-text-secondary);
        }
    }

    &__version {
        padding: var(--breeze-space-1) var(--breeze-space-2);
        border: 1px solid var(--breeze-accent-border);
        border-radius: var(--breeze-radius-control);
        background: var(--breeze-accent-soft);
        color: var(--breeze-accent-hover);
    }

    &__grid {
        display: grid;
        grid-template-columns: minmax(280px, 1fr) minmax(320px, 1fr);
        gap: var(--breeze-space-6);
    }

    &__controls {
        display: grid;
        align-content: start;
        gap: var(--breeze-space-3);
    }

    &__hint,
    &__status,
    .breeze-next-expert p {
        color: var(--breeze-text-muted);
    }

    &__status {
        min-block-size: var(--breeze-space-6);
    }
}

.breeze-next-accents {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--breeze-space-2);
    margin-block-start: var(--breeze-space-3);
    padding: 0;
    border: 0;

    legend {
        margin-block-end: var(--breeze-space-2);
        color: var(--breeze-text-secondary);
        font-weight: 600;
    }

    &__choice {
        display: flex;
        align-items: center;
        gap: var(--breeze-space-2);
        min-block-size: 44px;
        padding-inline: var(--breeze-space-2);
        border: 1px solid var(--breeze-border);
        border-radius: var(--breeze-radius-control);
        cursor: pointer;
    }

    &__choice:has(input:checked) {
        border-color: var(--breeze-accent);
        background: var(--breeze-accent-soft);
    }

    &__swatch {
        inline-size: 20px;
        block-size: 20px;
        border: 2px solid var(--breeze-border-strong);
        border-radius: 50%;
        background: var(--breeze-accent);
    }
}

.breeze-next-preview {
    h3 {
        margin-block-start: 0;
    }

    &__window {
        display: grid;
        grid-template-columns: 112px 1fr;
        min-block-size: 240px;
        overflow: hidden;
        border: 1px solid var(--breeze-border);
        border-radius: var(--breeze-radius-container);
        background: var(--breeze-surface-raised);
        box-shadow: var(--breeze-shadow-raised);

        nav {
            display: flex;
            flex-direction: column;
            gap: var(--breeze-space-1);
            padding: var(--breeze-space-3);
            background: var(--breeze-canvas);
        }

        nav span {
            padding: var(--breeze-space-2);
            border-radius: var(--breeze-radius-control);
        }

        nav .active {
            background: var(--breeze-accent-soft);
            box-shadow: inset 3px 0 var(--breeze-accent);
        }

        main {
            display: flex;
            flex-direction: column;
            gap: var(--breeze-space-2);
            padding: var(--breeze-space-4);
        }

        button {
            align-self: end;
            margin-block-start: auto;
            padding: var(--breeze-space-2) var(--breeze-space-4);
            border: 0;
            border-radius: var(--breeze-radius-control);
            background: var(--breeze-accent);
            color: var(--breeze-text-on-accent);
        }
    }

    &__row {
        padding: var(--breeze-space-2);
        border-block-end: 1px solid var(--breeze-border);

        &.selected {
            background: var(--breeze-accent-soft);
        }
    }
}

.breeze-next-expert {
    margin-block-start: var(--breeze-space-6);
    padding-block-start: var(--breeze-space-4);
    border-block-start: 1px solid var(--breeze-border);

    summary {
        cursor: pointer;
        font-weight: 600;
    }

    textarea {
        display: block;
        inline-size: 100%;
        min-block-size: 180px;
        margin-block: var(--breeze-space-3);
        font-family: monospace;
    }
}

@media (max-width: 768px) {
    .breeze-next-settings {
        padding: var(--breeze-space-4);

        &__grid {
            grid-template-columns: 1fr;
        }
    }
}
</style>
