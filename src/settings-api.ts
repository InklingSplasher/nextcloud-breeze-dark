export interface SettingsResponse {
    status: "ok" | "error";
    accent?: string;
    message?: string;
}

export async function postSettings(
    url: string,
    values: Record<string, string>,
): Promise<SettingsResponse> {
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
    const data = (await response.json()) as SettingsResponse;
    if (!response.ok || data.status !== "ok") {
        throw new Error(data.message ?? `Settings request failed with HTTP ${response.status}`);
    }
    return data;
}
