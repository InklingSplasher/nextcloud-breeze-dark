/**
 * InkCurity Dark admin settings for Nextcloud.
 *
 * @license GNU AGPL version 3 or any later version
 */

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
        throw new Error(`InkCurity Dark settings request failed with HTTP ${response.status}`);
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

    const ui = () => window.BreezeDarkUI;
    const notify = (options) => ui()?.showToast(options);
    const automaticHint = automaticActivation
        .closest(".tr-row")
        ?.querySelector("[data-tr-when-locked]");

    let saveQueue = Promise.resolve();
    const settingsValues = () => ({
        theme_enforced: enforceTheme.checked ? "1" : "0",
        theme_automatic_activation_enabled: automaticActivation.checked ? "1" : "0",
        theme_login_page: loginPage.checked ? "1" : "0",
    });
    const queueSave = (url, values, celebrate = false) => {
        if (typeof url !== "string" || url === "") {
            notify({ message: root.dataset.errorLabel, error: true });
            return;
        }

        saveQueue = saveQueue.catch(() => undefined).then(() => postBreezeDarkForm(url, values));
        saveQueue.then(
            () => {
                if (celebrate) {
                    ui()?.confetti();
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

    enforceTheme.addEventListener("change", () => {
        // Grey out, don't hide: the dependent switch stays visible with its reason.
        automaticActivation.disabled = !enforceTheme.checked;
        if (automaticHint instanceof HTMLElement) {
            automaticHint.textContent = enforceTheme.checked
                ? automaticHint.dataset.trWhenOpen
                : automaticHint.dataset.trWhenLocked;
        }
        queueSave(root.dataset.settingsUrl, settingsValues(), enforceTheme.checked);
    });

    automaticActivation.addEventListener("change", () => {
        queueSave(root.dataset.settingsUrl, settingsValues());
    });

    loginPage.addEventListener("change", () => {
        queueSave(root.dataset.settingsUrl, settingsValues());
    });

    customStylingButton.addEventListener("click", () => {
        queueSave(root.dataset.customStylingUrl, { theme_custom_styling: customStyling.value });
    });
});
