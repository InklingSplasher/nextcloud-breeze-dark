/**
 * Breeze Dark settings for Nextcloud.
 *
 * @license GNU AGPL version 3 or any later version
 */

function showBreezeDarkMessage(anchor, id, message, success) {
    if (!(anchor instanceof Element)) {
        return;
    }

    document.getElementById(id)?.remove();

    const status = document.createElement("span");
    status.id = id;
    status.classList.add("msg", success ? "success" : "error");
    status.textContent = ` ${message}`;
    anchor.insertAdjacentElement("afterend", status);

    window.setTimeout(() => status.remove(), 3000);
}

async function postBreezeDarkForm(url, values) {
    const requestToken = document.head.dataset.requesttoken;
    if (!requestToken) {
        throw new Error("Missing Nextcloud request token");
    }

    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            requesttoken: requestToken,
            "X-Requested-With": "XMLHttpRequest",
        },
        body: new URLSearchParams(values),
    });

    if (!response.ok) {
        throw new Error(`Breeze Dark settings request failed with HTTP ${response.status}`);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector(".breezedark-admin");
    if (!(root instanceof HTMLElement)) {
        return;
    }

    const enforceTheme = root.querySelector("#breezedark-theme-enabled");
    const automaticActivation = root.querySelector("#breezedark-automatic-activation-enabled");
    const loginPage = root.querySelector("#breezedark-theme-login-page");
    const customStyling = root.querySelector("#breezedark-theme-custom-styling");
    const customStylingButton = root.querySelector("#breezedark-theme-custom-styling-button");

    if (
        !(enforceTheme instanceof HTMLInputElement) ||
        !(automaticActivation instanceof HTMLInputElement) ||
        !(loginPage instanceof HTMLInputElement) ||
        !(customStyling instanceof HTMLTextAreaElement) ||
        !(customStylingButton instanceof HTMLButtonElement)
    ) {
        return;
    }

    let saveQueue = Promise.resolve();
    const settingsValues = () => ({
        theme_enforced: enforceTheme.checked ? "1" : "0",
        theme_automatic_activation_enabled: automaticActivation.checked ? "1" : "0",
        theme_login_page: loginPage.checked ? "1" : "0",
    });
    const queueSave = (url, values, anchor, messageId) => {
        if (typeof url !== "string" || url === "") {
            showBreezeDarkMessage(anchor, messageId, root.dataset.errorLabel, false);
            return;
        }

        saveQueue = saveQueue.catch(() => undefined).then(() => postBreezeDarkForm(url, values));
        saveQueue.then(
            () => showBreezeDarkMessage(anchor, messageId, root.dataset.savedLabel, true),
            () => showBreezeDarkMessage(anchor, messageId, root.dataset.errorLabel, false),
        );
    };

    enforceTheme.addEventListener("change", () => {
        automaticActivation.disabled = !enforceTheme.checked;
        queueSave(
            root.dataset.settingsUrl,
            settingsValues(),
            root.querySelector("label[for='breezedark-theme-enabled']"),
            "breezedark-theme-enabled-msg",
        );
    });

    automaticActivation.addEventListener("change", () => {
        queueSave(
            root.dataset.settingsUrl,
            settingsValues(),
            root.querySelector("label[for='breezedark-automatic-activation-enabled']"),
            "breezedark-theme-automatic-activation-enabled-msg",
        );
    });

    loginPage.addEventListener("change", () => {
        queueSave(
            root.dataset.settingsUrl,
            settingsValues(),
            root.querySelector("label[for='breezedark-theme-login-page']"),
            "breezedark-theme-login-page-msg",
        );
    });

    customStylingButton.addEventListener("click", () => {
        queueSave(
            root.dataset.customStylingUrl,
            { theme_custom_styling: customStyling.value },
            customStylingButton,
            "breezedark-theme-custom-styling-button-msg",
        );
    });
});
