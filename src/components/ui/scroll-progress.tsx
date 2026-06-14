import { useEffect, useState } from "react";

/** Slim gradient reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let raf = 0;
        const update = () => {
            const el = document.documentElement;
            const max = el.scrollHeight - el.clientHeight;
            setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
        };
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
            <div
                className="h-full bg-gradient-to-r from-aurora-violet via-aurora-cyan to-aurora-pink transition-[width] duration-75"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
