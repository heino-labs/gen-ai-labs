import { motion } from "framer-motion";
import { ChevronsDown } from "lucide-react";
import { site } from "@/lib/site";
import { stats } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

/** Depth 0 — the surface. Everything below is underground. */
export function Surface({ totalDepth }: { totalDepth: number }) {
    return (
        <section
            id="surface"
            className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
        >
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease }}
                className="font-mono text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]"
            >
                survey site · {site.name} · elevation 0 m
            </motion.p>

            <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.08 }}
                className="mt-6 font-display text-[clamp(2.8rem,8vw,6rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-[var(--fg)]"
            >
                Knowledge is
                <br />
                <span className="text-gradient">buried in strata.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.18 }}
                className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--fg-soft)]"
            >
                {site.description} Drill down — each layer of earth is a discipline,
                each core sample a guide.
            </motion.p>

            {/* survey data */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.28 }}
                className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] font-mono"
            >
                {[
                    { k: `${totalDepth} m`, v: "bore depth" },
                    { k: String(stats.categories), v: "strata" },
                    { k: String(stats.guides), v: "core samples" },
                ].map((s) => (
                    <div key={s.v} className="bg-[var(--bg-soft)] px-6 py-4">
                        <div className="text-xl font-bold tabular-nums text-[var(--fg)]">
                            {s.k}
                        </div>
                        <div className="mt-1 text-[10px] uppercase tracking-widest text-[var(--muted)]">
                            {s.v}
                        </div>
                    </div>
                ))}
            </motion.div>

            <motion.a
                href="#stratum-setup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="ring-focus group absolute bottom-10 flex flex-col items-center gap-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--muted)] transition-colors hover:text-brand"
            >
                begin descent
                <ChevronsDown className="h-4 w-4 animate-bounce" />
            </motion.a>

            {/* horizon line */}
            <div
                aria-hidden
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, var(--brand), transparent)",
                }}
            />
        </section>
    );
}
