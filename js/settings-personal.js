/**
 * Breeze Dark personal settings for Nextcloud.
 *
 * @license GNU AGPL version 3 or any later version
 */

function showBreezeDarkPersonalMessage(anchor, id, message, success) {
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

async function postBreezeDarkPersonalForm(url, values) {
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
    const root = document.querySelector(".breezedark-personal");
    if (!(root instanceof HTMLElement)) {
        return;
    }

    const themeEnabled = root.querySelector("#breezedark-enabled");
    const automaticActivation = root.querySelector("#breezedark-automatic-activation-enabled");
    if (
        !(themeEnabled instanceof HTMLInputElement) ||
        !(automaticActivation instanceof HTMLInputElement)
    ) {
        return;
    }

    let saveQueue = Promise.resolve();
    const values = () => ({
        theme_enabled: themeEnabled.checked ? "1" : "0",
        theme_automatic_activation_enabled: automaticActivation.checked ? "1" : "0",
    });
    const queueSave = (anchor, messageId) => {
        if (typeof root.dataset.settingsUrl !== "string" || root.dataset.settingsUrl === "") {
            showBreezeDarkPersonalMessage(anchor, messageId, root.dataset.errorLabel, false);
            return;
        }

        saveQueue = saveQueue
            .catch(() => undefined)
            .then(() => postBreezeDarkPersonalForm(root.dataset.settingsUrl, values()));
        saveQueue.then(
            () => showBreezeDarkPersonalMessage(anchor, messageId, root.dataset.savedLabel, true),
            () => showBreezeDarkPersonalMessage(anchor, messageId, root.dataset.errorLabel, false),
        );
    };

    themeEnabled.addEventListener("change", () => {
        queueSave(root.querySelector("label[for='breezedark-enabled']"), "breezedark-enabled-msg");
    });
    automaticActivation.addEventListener("change", () => {
        queueSave(
            root.querySelector("label[for='breezedark-automatic-activation-enabled']"),
            "breezedark-automatic-activation-enabled-msg",
        );
    });
});
