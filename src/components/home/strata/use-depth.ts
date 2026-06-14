import { useEffect, useState } from "react";

/**
 * STRATA — the single axis of the whole layout is DEPTH.
 * Scroll progress (0..1) is mapped to metres below the surface.
 * Also tracks which stratum (section id) currently holds the drill head.
 */
export function useDepth(totalDepth: number, sectionIds: string[]) {
    const [depth, setDepth] = useState(0);
    const [progress, setProgress] = useState(0);
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
                setProgress(p);
                setDepth(Math.round(p * totalDepth));
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [totalDepth]);

    useEffect(() => {
        const els = sectionIds
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => Boolean(el));
        if (!els.length) return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) setActive(e.target.id);
                }
            },
            { rootMargin: "-42% 0px -42% 0px" }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionIds.join("|")]);

    return { depth, progress, active };
}
