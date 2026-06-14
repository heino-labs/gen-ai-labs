import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { site } from "@/lib/site";
import { stats } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

const terminalLines = [
    { p: "$", c: "multipass launch --name Ubuntu-S1", t: "text-aurora-cyan" },
    { p: ">", c: "Launched: Ubuntu-S1", t: "text-[#6b7194]" },
    { p: "$", c: "multipass shell Ubuntu-S1", t: "text-aurora-cyan" },
    { p: ">", c: "Welcome to Ubuntu 22.04 LTS", t: "text-aurora-teal" },
    { p: "$", c: "sudo apt update && sudo apt install gitlab-ee", t: "text-aurora-violet" },
];

export function Hero() {
    return (
        <section className="relative mx-auto max-w-7xl px-4 pt-32 sm:px-6 lg:px-8 lg:pt-40">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Left */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease }}
                        className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-[var(--fg-soft)]"
                    >
                        <Sparkles className="h-3.5 w-3.5 text-aurora-violet" />
                        {site.tagline} · live & growing
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aurora-teal" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.06 }}
                        className="mt-6 font-display text-[clamp(2.6rem,6vw,4.7rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-[var(--fg)]"
                    >
                        Master the craft,
                        <br />
                        <span className="text-gradient animate-gradient-x animate-text-grad bg-aurora-grad bg-clip-text">
                            one guide at a time.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.14 }}
                        className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--fg-soft)]"
                    >
                        {site.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.22 }}
                        className="mt-9 flex flex-wrap items-center gap-3"
                    >
                        <Link
                            href="/setup"
                            className="ring-focus group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-aurora-grad px-5 py-3 text-sm font-semibold text-white shadow-glow"
                        >
                            <span className="absolute inset-0 animate-gradient-x bg-aurora-grad opacity-0 [background-size:200%_200%] transition-opacity group-hover:opacity-100" />
                            <span className="relative flex items-center gap-2">
                                Start with Setup
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </Link>
                        <a
                            href="#categories"
                            className="ring-focus glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[var(--fg)] transition-colors hover:text-brand"
                        >
                            Browse categories
                        </a>
                    </motion.div>

                    {/* stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.3 }}
                        className="mt-12 flex gap-8"
                    >
                        {[
                            { k: stats.categories, v: "Categories" },
                            { k: stats.guides, v: "Guides" },
                            { k: stats.live, v: "Live tracks" },
                        ].map((s) => (
                            <div key={s.v}>
                                <div className="font-display text-3xl font-extrabold text-[var(--fg)]">
                                    {s.k}
                                    <span className="text-gradient">+</span>
                                </div>
                                <div className="text-xs uppercase tracking-widest text-[var(--muted)]">
                                    {s.v}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Right: floating terminal */}
                <motion.div
                    initial={{ opacity: 0, y: 30, rotateX: 8 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-aurora-grad opacity-20 blur-3xl" />
                    <div className="animate-float overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[#0b0b16] shadow-glass">
                        <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
                            <span className="flex gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                            </span>
                            <span className="ml-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#8186a6]">
                                <Terminal className="h-3.5 w-3.5" /> apt-92 — bash
                            </span>
                        </div>
                        <div className="space-y-2 p-5 font-mono text-[13px] leading-relaxed">
                            {terminalLines.map((l, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.18, duration: 0.4 }}
                                    className="flex gap-2"
                                >
                                    <span className="select-none text-[#3f4467]">{l.p}</span>
                                    <span className={l.t}>{l.c}</span>
                                </motion.div>
                            ))}
                            <motion.span
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.1 }}
                                className="inline-block h-4 w-2 translate-y-0.5 bg-aurora-cyan"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
