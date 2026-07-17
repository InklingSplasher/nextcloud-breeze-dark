export const ACCENTS = ["plasma", "iris", "coral", "mint", "honey"] as const;

export type Accent = (typeof ACCENTS)[number];
export type UserAccent = Accent | "default";

export function isAccent(value: unknown): value is Accent {
    return typeof value === "string" && ACCENTS.some((accent) => accent === value);
}

export function isUserAccent(value: unknown): value is UserAccent {
    return value === "default" || isAccent(value);
}

export function resolveAccent(userAccent: unknown, serverAccent: unknown): Accent {
    const fallback = isAccent(serverAccent) ? serverAccent : "plasma";
    return userAccent === "default" ? fallback : isAccent(userAccent) ? userAccent : fallback;
}

export function applyAccent(accent: unknown, documentRoot: Document = document): Accent {
    const resolved = isAccent(accent) ? accent : "plasma";
    documentRoot.documentElement.dataset.breezeAccent = resolved;
    if (documentRoot.body) {
        documentRoot.body.dataset.breezeAccent = resolved;
    }
    return resolved;
}
