import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import type { Category, Post } from "@/lib/content";
import { Icon } from "@/components/ui/icon";
import { jaggedPath, tiltFor } from "./seed";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Rhythm rule: specimens drift left → right → centre in a 3-phase cycle.
 * Looks irregular, is fully deterministic.
 */
const PHASE = [
    "md:ml-[6%] md:w-[58%]",
    "md:ml-[40%] md:w-[54%]",
    "md:ml-[20%] md:w-[56%]",
];

export function Stratum({
    category: c,
    posts,
    index,
    depthStart,
    spacing,
}: {
    category: Category;
    posts: Post[];
    index: number;
    depthStart: number;
    spacing: number;
}) {
    const locked = c.status !== "live";
    const headerRight = index % 2 === 1; // alternation rule

    return (
        <section
            id={`stratum-${c.slug}`}
            className="relative scroll-mt-4"
            style={{
                background: `linear-gradient(180deg, ${c.accent[0]}0d 0%, ${c.accent[1]}08 60%, transparent 100%)`,
            }}
        >
            {/* jagged geological boundary — generated from the slug hash */}
            <svg
                aria-hidden
                viewBox="0 0 1200 40"
                preserveAspectRatio="none"
                className="absolute -top-[39px] left-0 h-10 w-full"
            >
                <path d={jaggedPath(c.slug)} fill={`${c.accent[0]}14`} />
                <path
                    d={jaggedPath(c.slug)}
                    fill="none"
                    stroke={`${c.accent[0]}55`}
                    strokeWidth="1"
                />
            </svg>

            <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
                {/* stratum header */}
                <motion.header
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease }}
                    className={headerRight ? "md:text-right" : ""}
                >
                    <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]">
                        stratum {String(index + 1).padStart(2, "0")} · −{depthStart} m
                        {locked && " · unexcavated"}
                    </p>
                    <h2
                        className="mt-3 flex items-center gap-4 font-display text-[clamp(2rem,5vw,3.4rem)] font-extrabold tracking-[-0.03em]"
                        style={{
                            color: locked ? "var(--muted)" : "var(--fg)",
                            flexDirection: headerRight ? "row-reverse" : "row",
                        }}
                    >
                        <span
                            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
                            style={{
                                borderColor: `${c.accent[0]}55`,
                                background: `${c.accent[0]}14`,
                                color: c.accent[0],
                            }}
                        >
                            {locked ? <Lock className="h-5 w-5" /> : <Icon name={c.icon} className="h-5 w-5" />}
                        </span>
                        {c.title}
                    </h2>
                    <p
                        className={`mt-4 max-w-md text-[var(--fg-soft)] ${
                            headerRight ? "md:ml-auto" : ""
                        }`}
                    >
                        {c.description}
                    </p>
                    {/* mineral content = tags */}
                    <div
                        className={`mt-4 flex flex-wrap gap-2 ${
                            headerRight ? "md:justify-end" : ""
                        }`}
                    >
                        {c.tags.map((t) => (
                            <span
                                key={t}
                                className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                                style={{
                                    borderColor: `${c.accent[0]}40`,
                                    color: c.accent[0],
                                }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </motion.header>

                {/* borehole + specimens */}
                <div className="relative mt-14">
                    <div
                        aria-hidden
                        className="absolute bottom-0 top-0 hidden w-px md:left-[3%] md:block"
                        style={{
                            background: `linear-gradient(180deg, ${c.accent[0]}66, transparent)`,
                        }}
                    />
                    <div className="space-y-10">
                        {posts.map((p, j) => {
                            const depth = depthStart + Math.round(((j + 1) / (posts.length + 1)) * spacing);
                            return (
                                <motion.div
                                    key={p.slug}
                                    initial={{ opacity: 0, y: 28 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, ease, delay: (j % 3) * 0.08 }}
                                    className={PHASE[j % PHASE.length]}
                                    style={{ rotate: `${tiltFor(p.slug)}deg` }}
                                >
                                    <Link
                                        href={p.slug}
                                        className={`ring-focus group block rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-5 backdrop-blur transition-all hover:-translate-y-1 ${
                                            locked ? "opacity-60" : ""
                                        }`}
                                        style={
                                            locked
                                                ? {
                                                      backgroundImage:
                                                          "repeating-linear-gradient(135deg, transparent 0 10px, rgba(127,127,127,0.05) 10px 11px)",
                                                  }
                                                : undefined
                                        }
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.borderColor = `${c.accent[0]}88`;
                                            (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px -16px ${c.accent[0]}66`;
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.borderColor = "";
                                            (e.currentTarget as HTMLElement).style.boxShadow = "";
                                        }}
                                    >
                                        <div className="flex items-baseline justify-between gap-4">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
                                                core sample · −{depth} m
                                            </p>
                                            <span className="font-mono text-[10px] text-[var(--muted)]">
                                                {p.readingTime}
                                            </span>
                                        </div>
                                        <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-bold text-[var(--fg)]">
                                            {p.title}
                                            <ArrowUpRight
                                                className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                                                style={{ color: c.accent[0] }}
                                            />
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-[var(--fg-soft)]">
                                            {p.description}
                                        </p>
                                    </Link>
                                </motion.div>
                            );
                        })}

                        {!posts.length && (
                            <p className="font-mono text-sm text-[var(--muted)]">
                                — no samples extracted yet —
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
