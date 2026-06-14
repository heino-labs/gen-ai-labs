import { motion } from "framer-motion";
import { Github, Mail } from "lucide-react";
import { site } from "@/lib/site";

/** The bottom of the bore — molten core as footer. */
export function Core({ totalDepth }: { totalDepth: number }) {
    return (
        <footer className="relative overflow-hidden px-6 pb-16 pt-32 text-center">
            {/* magma glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
                style={{
                    background:
                        "radial-gradient(60% 100% at 50% 100%, rgba(251,191,36,0.22), rgba(244,114,182,0.12) 45%, transparent 75%)",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
            >
                <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">
                    bedrock reached · −{totalDepth} m
                </p>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--fg)]">
                    <span className="text-gradient-warm">The core.</span>
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-[var(--fg-soft)]">
                    Every layer above was drilled by hand. New strata are deposited
                    regularly — come back and dig deeper.
                </p>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <a
                        href={site.github}
                        target="_blank"
                        rel="noreferrer"
                        className="ring-focus glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--fg)] transition-colors hover:text-brand"
                    >
                        <Github className="h-4 w-4" /> GitHub
                    </a>
                    <a
                        href="mailto:batd@htplus.software"
                        className="ring-focus glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--fg)] transition-colors hover:text-brand"
                    >
                        <Mail className="h-4 w-4" /> Contact
                    </a>
                </div>

                <p className="mt-10 font-mono text-[11px] text-[var(--muted)]">
                    © {site.year} {site.author} · {site.name} · all depths surveyed
                </p>
            </motion.div>
        </footer>
    );
}
