/**
 * InkCurity Dark personal settings for Nextcloud.
 *
 * @license GNU AGPL version 3 or any later version
 */

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
        throw new Error(`InkCurity Dark settings request failed with HTTP ${response.status}`);
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

    const ui = () => window.BreezeDarkUI;
    const notify = (options) => ui()?.showToast(options);

    let saveQueue = Promise.resolve();
    const values = () => ({
        theme_enabled: themeEnabled.checked ? "1" : "0",
        theme_automatic_activation_enabled: automaticActivation.checked ? "1" : "0",
    });
    const queueSave = (celebrateFrom) => {
        if (typeof root.dataset.settingsUrl !== "string" || root.dataset.settingsUrl === "") {
            notify({ message: root.dataset.errorLabel, error: true });
            return;
        }

        saveQueue = saveQueue
            .catch(() => undefined)
            .then(() => postBreezeDarkPersonalForm(root.dataset.settingsUrl, values()));
        saveQueue.then(
            () => {
                if (celebrateFrom) {
                    // The reward follows the action: one splash of ink from the switch.
                    ui()?.splash(celebrateFrom);
                    notify({
                        message: root.dataset.enabledLabel,
                        actionLabel: root.dataset.reloadLabel,
                        onAction: () => window.location.reload(),
                        duration: 7000,
                    });
                } else {
                    notify({ message: root.dataset.savedLabel });
                }
            },
            () => notify({ message: root.dataset.errorLabel, error: true }),
        );
    };

    themeEnabled.addEventListener("change", () =>
        queueSave(themeEnabled.checked ? themeEnabled : null),
    );
    automaticActivation.addEventListener("change", () => queueSave(null));
});
