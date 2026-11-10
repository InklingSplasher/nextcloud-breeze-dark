/**
 * InkCurity Dark — feedback for the theme's own pages: a toast from above
 * (Trumpf: 4.2 s, one action) and a splash of ink (InkCurity: the splash
 * engine of the design system, cut down to splats and bursts, in the blues of
 * the theme). Ink only follows an action and never flies with reduced motion.
 *
 * @copyright Copyright (C) 2026 inkcurity.net
 *
 * @license GNU AGPL version 3 or any later version
 */

(function () {
    const reducedMotion = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        (document.body?.dataset.themes ?? "").includes("reduced-motion");

    /* Toast ---------------------------------------------------------------- */

    const TOAST_STYLE = `
.ic-ui-toast-layer { position: fixed; top: 0; right: 0; left: 0; z-index: 100001; display: grid; justify-items: center; padding: 56px 16px 0; pointer-events: none; }
.ic-ui-toast { display: flex; width: 100%; max-width: 384px; box-sizing: border-box; align-items: center; gap: 12px; padding: 8px 8px 8px 16px; border-radius: 14px; background: #132541; color: #dce5f2; box-shadow: 0 0 0 1px #2a4568, 0 18px 40px -12px rgba(0, 0, 0, 0.7), 0 24px 60px -30px rgba(92, 200, 255, 0.3); pointer-events: auto; font: 500 14px/1.4 "Geist", system-ui, sans-serif; animation: ic-ui-toast-in 480ms cubic-bezier(0.32, 0.72, 0, 1) both; }
.ic-ui-toast.is-leaving { animation: ic-ui-toast-out 260ms cubic-bezier(0.32, 0.72, 0, 1) both; }
.ic-ui-toast__dot { flex-shrink: 0; width: 7px; height: 7px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 10px rgba(74, 222, 128, 0.7); }
.ic-ui-toast.is-error .ic-ui-toast__dot { background: #ff5577; box-shadow: 0 0 10px rgba(255, 85, 119, 0.7); }
.ic-ui-toast__message { flex: 1; min-width: 0; padding: 6px 0; }
.ic-ui-toast__action { flex-shrink: 0; min-height: 32px; padding: 0 12px; border: 0; border-radius: 10px; background: rgba(92, 200, 255, 0.14); color: #8fd6ff; font: 600 14px/20px "Geist", system-ui, sans-serif; cursor: pointer; }
.ic-ui-toast__action:hover { background: rgba(92, 200, 255, 0.2); }
.ic-ui-toast__action:active { transform: scale(0.985); }
.ic-ui-toast__action:focus-visible { outline: 2px solid #5cc8ff; outline-offset: 2px; }
@keyframes ic-ui-toast-in { from { opacity: 0; transform: translateY(-120%) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes ic-ui-toast-out { to { opacity: 0; transform: translateY(-120%) scale(0.96); } }
@media (prefers-reduced-motion: reduce) { .ic-ui-toast, .ic-ui-toast.is-leaving { animation-duration: 0.01ms; } }
`;

    let layer = null;
    let current = null;
    let timer = 0;

    function ensureLayer() {
        if (layer) {
            return layer;
        }
        const style = document.createElement("style");
        style.textContent = TOAST_STYLE;
        document.head.appendChild(style);
        layer = document.createElement("div");
        layer.className = "ic-ui-toast-layer";
        layer.setAttribute("role", "status");
        layer.setAttribute("aria-live", "polite");
        document.body.appendChild(layer);
        return layer;
    }

    function dismiss(toast) {
        if (!toast || toast.classList.contains("is-leaving")) {
            return;
        }
        toast.classList.add("is-leaving");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
        window.setTimeout(() => toast.remove(), 400);
    }

    function showToast({
        message,
        error = false,
        actionLabel = "",
        onAction = null,
        duration = 4200,
    }) {
        const host = ensureLayer();
        dismiss(current);
        window.clearTimeout(timer);

        const toast = document.createElement("div");
        toast.className = "ic-ui-toast" + (error ? " is-error" : "");

        const dot = document.createElement("span");
        dot.className = "ic-ui-toast__dot";
        dot.setAttribute("aria-hidden", "true");

        const text = document.createElement("span");
        text.className = "ic-ui-toast__message";
        text.textContent = message;

        toast.append(dot, text);

        if (actionLabel && typeof onAction === "function") {
            const action = document.createElement("button");
            action.type = "button";
            action.className = "ic-ui-toast__action";
            action.textContent = actionLabel;
            action.addEventListener("click", () => {
                dismiss(toast);
                onAction();
            });
            toast.append(action);
        }

        host.appendChild(toast);
        current = toast;
        timer = window.setTimeout(() => dismiss(toast), duration);
        return toast;
    }

    /* Ink ------------------------------------------------------------------- */

    // The blues of the theme, the deep end of the fire, and one magenta guest.
    const INK = ["#5cc8ff", "#5cc8ff", "#8fd6ff", "#2f4dff", "#3d7bff", "#ff3d8e"];

    let canvas = null;
    let ctx = null;
    let width = 0;
    let height = 0;
    let frame = 0;
    const splats = [];

    function ensureCanvas() {
        if (canvas) {
            return;
        }
        canvas = document.createElement("canvas");
        canvas.setAttribute("aria-hidden", "true");
        Object.assign(canvas.style, {
            position: "fixed",
            inset: "0",
            width: "100vw",
            height: "100vh",
            zIndex: "100000",
            pointerEvents: "none",
        });
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        resize();
        window.addEventListener("resize", resize);
    }

    function resize() {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    const pick = (colors, except) => {
        let color;
        let tries = 0;
        do {
            color = colors[Math.floor(Math.random() * colors.length)];
        } while (color === except && tries++ < 4);
        return color;
    };

    // An organic blob: points around a circle, jittered, a few spikes, closed
    // with Catmull-Rom curves.
    function blob(radius, jitter, spikes) {
        const count = 12 + Math.floor(Math.random() * 6);
        const points = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
            let r = radius * (1 + (Math.random() - 0.5) * jitter * 2);
            if (Math.random() < spikes) {
                r *= 1.3 + Math.random() * 0.6;
            }
            points.push([Math.cos(angle) * r, Math.sin(angle) * r]);
        }
        const path = new Path2D();
        path.moveTo(points[0][0], points[0][1]);
        for (let i = 0; i < count; i++) {
            const p0 = points[(i - 1 + count) % count];
            const p1 = points[i];
            const p2 = points[(i + 1) % count];
            const p3 = points[(i + 2) % count];
            path.bezierCurveTo(
                p1[0] + (p2[0] - p0[0]) / 6,
                p1[1] + (p2[1] - p0[1]) / 6,
                p2[0] - (p3[0] - p1[0]) / 6,
                p2[1] - (p3[1] - p1[1]) / 6,
                p2[0],
                p2[1],
            );
        }
        path.closePath();
        return path;
    }

    function makeSplat(x, y, size, colors) {
        const main = pick(colors);
        const parts = [
            {
                kind: "blob",
                dx: 0,
                dy: 0,
                rot: Math.random() * 6.3,
                color: main,
                path: blob(size / 2, 0.32, 0.28),
            },
        ];
        for (let i = 0, n = 2 + Math.floor(Math.random() * 2); i < n; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = size * (0.3 + Math.random() * 0.45);
            const r = size * (0.12 + Math.random() * 0.18);
            parts.push({
                kind: "blob",
                dx: Math.cos(angle) * distance,
                dy: Math.sin(angle) * distance,
                rot: Math.random() * 6.3,
                color: Math.random() < 0.3 ? pick(colors, main) : main,
                path: blob(r, 0.4, 0.35),
            });
        }
        for (let i = 0, n = 10 + Math.floor(Math.random() * 8); i < n; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = size * (0.35 + Math.pow(Math.random(), 0.6));
            parts.push({
                kind: "drop",
                dx: Math.cos(angle) * distance,
                dy: Math.sin(angle) * distance,
                r: 1.5 + Math.random() * Math.max(3, size * 0.025),
                color: Math.random() < 0.18 ? pick(colors, main) : main,
            });
        }
        return { x, y, parts, birth: performance.now(), grow: 620, hold: 1300, fade: 700 };
    }

    // Grows with a small overshoot, holds, then fades while it spreads a little.
    const easeOutBack = (t) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);

    function draw(now) {
        frame = 0;
        ctx.clearRect(0, 0, width, height);
        for (let i = splats.length - 1; i >= 0; i--) {
            const s = splats[i];
            const age = now - s.birth;
            if (age >= s.grow + s.hold + s.fade) {
                splats.splice(i, 1);
                continue;
            }
            let scale = 1;
            let alpha = 0.92;
            if (age < s.grow) {
                const t = age / s.grow;
                scale = Math.max(0, easeOutBack(t));
                alpha = Math.min(0.92, t * 2);
            } else if (age > s.grow + s.hold) {
                const t = (age - s.grow - s.hold) / s.fade;
                scale = 1 + t * 0.06;
                alpha = 0.92 * (1 - t * t);
            }
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(s.x, s.y);
            for (const part of s.parts) {
                ctx.fillStyle = part.color;
                if (part.kind === "blob") {
                    ctx.save();
                    ctx.translate(part.dx * scale, part.dy * scale);
                    ctx.rotate(part.rot);
                    ctx.scale(scale, scale);
                    ctx.fill(part.path);
                    ctx.restore();
                } else {
                    ctx.beginPath();
                    ctx.arc(
                        part.dx * scale,
                        part.dy * scale,
                        Math.max(0, part.r * scale),
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                }
            }
            ctx.restore();
        }
        if (splats.length) {
            frame = window.requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, width, height);
        }
    }

    function splatAt(x, y, size, colors = INK) {
        if (reducedMotion()) {
            return;
        }
        ensureCanvas();
        splats.push(makeSplat(x, y, size, colors));
        if (!frame) {
            frame = window.requestAnimationFrame(draw);
        }
    }

    // One splash of ink from an element (or a point), the size of a reward, in the light blues.
    function splash(origin, colors = ["#5cc8ff", "#5cc8ff", "#8fd6ff", "#3d7bff"]) {
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 3;
        if (origin instanceof Element) {
            const box = origin.getBoundingClientRect();
            x = box.left + box.width / 2;
            y = box.top + box.height / 2;
        } else if (origin && typeof origin.x === "number") {
            ({ x, y } = origin);
        }
        splatAt(x, y, 110 + Math.random() * 40, colors);
    }

    // The easter egg: ink all over the page, staggered.
    function burst(count = 14, colors = INK) {
        for (let i = 0; i < count; i++) {
            window.setTimeout(
                () =>
                    splatAt(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight,
                        140 + Math.random() * 240,
                        colors,
                    ),
                i * 60,
            );
        }
    }

    // Kept for older callers: the reward is ink now.
    const confetti = () => splash(null);

    window.BreezeDarkUI = { showToast, splash, burst, confetti };
})();
