/**
 * InkCurity Dark — Trumpf feedback for the theme's own settings pages:
 * a toast from above (material, 4.2 s, one action) and confetti in the
 * colours of the reward. Confetti only follows an action and never plays
 * with reduced motion.
 *
 * @copyright Copyright (C) 2026 inkcurity.net
 *
 * @license GNU AGPL version 3 or any later version
 */

(function () {
    const reducedMotion = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        (document.body?.dataset.themes ?? "").includes("reduced-motion");

    const TOAST_STYLE = `
.tr-ui-toast-layer { position: fixed; top: 0; right: 0; left: 0; z-index: 100001; display: grid; justify-items: center; padding: 58px 16px 0; pointer-events: none; }
.tr-ui-toast { display: flex; width: 100%; max-width: 384px; box-sizing: border-box; align-items: center; gap: 12px; padding: 8px 8px 8px 14px; border-radius: 22px; background: rgba(40, 51, 95, 0.82); color: #f5f6fb; box-shadow: 0 12px 32px rgba(3, 6, 20, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.07); -webkit-backdrop-filter: saturate(180%) blur(20px); backdrop-filter: saturate(180%) blur(20px); pointer-events: auto; font: 500 15px/1.375 var(--font-face, system-ui, sans-serif); animation: tr-ui-toast-in 480ms cubic-bezier(0.32, 0.72, 0, 1) both; }
.tr-ui-toast.is-leaving { animation: tr-ui-toast-out 260ms cubic-bezier(0.32, 0.72, 0, 1) both; }
.tr-ui-toast__icon { display: grid; flex-shrink: 0; width: 22px; height: 22px; place-items: center; border-radius: 50%; background: #30d158; color: #06210f; }
.tr-ui-toast.is-error .tr-ui-toast__icon { background: #ff6961; color: #2a0a0a; }
.tr-ui-toast__message { flex: 1; min-width: 0; }
.tr-ui-toast__action { flex-shrink: 0; padding: 6px 12px; border: 0; border-radius: 999px; background: rgba(141, 173, 244, 0.22); color: #c4d5ff; font: 600 15px/20px var(--font-face, system-ui, sans-serif); cursor: pointer; }
.tr-ui-toast__action:active { transform: scale(0.97); }
@keyframes tr-ui-toast-in { from { opacity: 0; transform: translateY(-120%) scale(0.96); } to { opacity: 1; transform: none; } }
@keyframes tr-ui-toast-out { to { opacity: 0; transform: translateY(-120%) scale(0.96); } }
@media (prefers-reduced-motion: reduce) { .tr-ui-toast, .tr-ui-toast.is-leaving { animation-duration: 0.01ms; } }
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
        layer.className = "tr-ui-toast-layer";
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
        toast.className = "tr-ui-toast" + (error ? " is-error" : "");

        const icon = document.createElement("span");
        icon.className = "tr-ui-toast__icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = error ? "!" : "✓";

        const text = document.createElement("span");
        text.className = "tr-ui-toast__message";
        text.textContent = message;

        toast.append(icon, text);

        if (actionLabel && typeof onAction === "function") {
            const action = document.createElement("button");
            action.type = "button";
            action.className = "tr-ui-toast__action";
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

    function confetti(colors = ["#336deb", "#ec4899", "#f0c454", "#5bd49a", "#7bd6eb", "#ffffff"]) {
        if (reducedMotion()) {
            return;
        }

        const canvas = document.createElement("canvas");
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.setAttribute("aria-hidden", "true");
        Object.assign(canvas.style, {
            position: "fixed",
            inset: "0",
            width: "100%",
            height: "100%",
            zIndex: "100000",
            pointerEvents: "none",
        });
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        ctx.scale(ratio, ratio);

        // 90 pieces of paper from the banner at the top, with drag, sway and flip.
        const pieces = Array.from({ length: 90 }, () => ({
            x: width / 2 + (Math.random() - 0.5) * Math.min(width, 520),
            y: 40 + Math.random() * 30,
            vx: (Math.random() - 0.5) * 9,
            vy: -4 - Math.random() * 7,
            w: 6 + Math.random() * 6,
            h: 9 + Math.random() * 8,
            spin: Math.random() * Math.PI,
            spinSpeed: (Math.random() - 0.5) * 0.3,
            sway: Math.random() * Math.PI * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 2600 + Math.random() * 1300,
        }));

        const start = performance.now();
        let last = start;

        function frame(now) {
            const dt = Math.min(32, now - last) / 16.67;
            last = now;
            ctx.clearRect(0, 0, width, height);
            let alive = 0;
            for (const p of pieces) {
                const age = now - start;
                if (age > p.life) {
                    continue;
                }
                alive++;
                p.vx *= 0.985;
                p.vy = p.vy * 0.985 + 0.22 * dt;
                p.sway += 0.08 * dt;
                p.x += (p.vx + Math.sin(p.sway) * 0.8) * dt;
                p.y += p.vy * dt;
                p.spin += p.spinSpeed * dt;
                ctx.save();
                ctx.globalAlpha = Math.min(1, (p.life - age) / 500);
                ctx.translate(p.x, p.y);
                ctx.rotate(p.spin);
                ctx.scale(1, Math.cos(p.spin * 2));
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            }
            if (alive > 0) {
                window.requestAnimationFrame(frame);
            } else {
                canvas.remove();
            }
        }

        window.requestAnimationFrame(frame);
    }

    window.BreezeDarkUI = { showToast, confetti };
})();
