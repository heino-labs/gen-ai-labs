"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    ChevronsDown,
    Github,
    Lock,
    Mail,
    Sparkles,
} from "lucide-react";
import {
    courseCategories,
    stats,
    type Category,
} from "@/lib/content";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

const ORBITS: { x: string; y: string; size: number }[] = [
    { x: "50%", y: "42%", size: 88 },
    { x: "18%", y: "28%", size: 64 },
    { x: "78%", y: "24%", size: 58 },
    { x: "72%", y: "58%", size: 70 },
    { x: "22%", y: "62%", size: 56 },
    { x: "48%", y: "72%", size: 52 },
    { x: "88%", y: "48%", size: 48 },
    { x: "10%", y: "48%", size: 50 },
];

function sortForUniverse(cats: Category[]): Category[] {
    const order = ["course", "linux", "devops", "docker"];
    return [...cats].sort(
        (a, b) => order.indexOf(a.slug) - order.indexOf(b.slug)
    );
}

export function UniverseHome() {
    const router = useRouter();
    const worlds = useMemo(() => sortForUniverse(courseCategories()), []);
    const liveCount = worlds.filter((c) => c.status === "live").length;

    return (
        <div className="relative min-h-[100svh] overflow-x-hidden">
            <Starfield fixed />

            <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-4 sm:px-6">
                <span className="font-display text-sm font-bold tracking-tight text-[var(--fg)]">
                    {site.name || site.tagline}
                </span>
                <span className="glass">
                    <ThemeToggle />
                </span>
            </header>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease }}
            >
                        <section
                            id="surface"
                            className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pb-20 pt-24 text-center"
                        >
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, ease }}
                                className="font-mono text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]"
                            >
                                knowledge universe · {site.author}
                            </motion.p>

                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease, delay: 0.08 }}
                                className="mt-6 font-display text-[clamp(2.6rem,7vw,5.2rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-[var(--fg)]"
                            >
                                Knowledge is
                                <br />
                                <span className="text-gradient">out there.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease, delay: 0.18 }}
                                className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--fg-soft)]"
                            >
                                {site.description} Chọn một thế giới — mỗi hành tinh
                                mở menu kiến thức riêng.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease, delay: 0.28 }}
                                className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] font-mono"
                            >
                                {[
                                    { k: String(liveCount), v: "khoá live" },
                                    { k: String(worlds.length), v: "khoá học" },
                                    { k: String(stats.guides), v: "lessons" },
                                ].map((s) => (
                                    <div
                                        key={s.v}
                                        className="bg-[var(--bg-soft)]/80 px-5 py-4 backdrop-blur sm:px-6"
                                    >
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
                                href="#universe"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="ring-focus group absolute bottom-10 flex flex-col items-center gap-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--muted)] transition-colors hover:text-brand"
                            >
                                enter the universe
                                <ChevronsDown className="h-4 w-4 animate-bounce" />
                            </motion.a>

                            <div
                                aria-hidden
                                className="absolute bottom-0 left-0 right-0 h-px"
                                style={{
                                    background:
                                        "linear-gradient(90deg, transparent, var(--brand), transparent)",
                                }}
                            />
                        </section>

                        <section
                            id="universe"
                            className="relative scroll-mt-4 px-4 py-20 sm:px-6 lg:py-28"
                        >
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-x-0 top-1/2 h-[85%] -translate-y-1/2"
                                style={{
                                    background:
                                        "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(34,211,238,0.16), rgba(124,92,255,0.1) 42%, transparent 70%)",
                                }}
                            />

                            <div className="relative mx-auto max-w-2xl text-center">
                                <p className="inline-flex items-center gap-2 rounded-full border border-aurora-cyan/30 bg-aurora-cyan/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.28em] text-aurora-cyan">
                                    <Sparkles className="h-3 w-3" />
                                    constellation
                                </p>
                                <h2 className="mt-5 font-display text-[clamp(1.9rem,4.5vw,3rem)] font-extrabold leading-tight tracking-tight text-[var(--fg)]">
                                    Chọn khoá học,
                                    <span className="text-gradient"> mở kiến thức</span>
                                </h2>
                                <p className="mx-auto mt-3 max-w-md text-[var(--fg-soft)]">
                                    Linux · DevOps · Docker · AI BA/Tester — mỗi hành
                                    tinh là một khoá.
                                </p>
                            </div>

                            <div className="relative mx-auto mt-12 h-[min(72vh,600px)] w-full max-w-4xl rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/30 shadow-[0_0_80px_-20px_rgba(34,211,238,0.35)] backdrop-blur-sm">
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-aurora-cyan/25"
                                />
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-aurora-violet/30"
                                />
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aurora-cyan/80 shadow-[0_0_24px_8px_rgba(34,211,238,0.45)]"
                                />

                                {worlds.map((cat, i) => {
                                    const seat = ORBITS[i % ORBITS.length];
                                    return (
                                        <Planet
                                            key={cat.slug}
                                            category={cat}
                                            x={seat.x}
                                            y={seat.y}
                                            size={seat.size + 6}
                                            delay={i * 0.06}
                                            onSelect={() => {
                                                void router.push(
                                                    cat.slug === "course"
                                                        ? "/course"
                                                        : `/${cat.slug}`
                                                );
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            <p className="relative mx-auto mt-8 max-w-sm text-center font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--fg-soft)]">
                                {liveCount} khoá đang mở · click để vào
                            </p>
                        </section>

                        <UniverseFooter />
            </motion.div>
        </div>
    );
}

function UniverseFooter() {
    return (
        <footer className="relative overflow-hidden px-6 pb-16 pt-28 text-center">
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
                    edge of known space
                </p>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--fg)]">
                    <span className="text-gradient-warm">The core.</span>
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm text-[var(--fg-soft)]">
                    Mỗi thế giới được dựng bằng tay. Hệ mới vẫn đang hình thành —
                    quay lại và khám phá tiếp.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/course"
                        className="ring-focus inline-flex items-center gap-2 rounded-xl bg-aurora-grad px-4 py-2.5 text-sm font-semibold text-white shadow-glow"
                    >
                        AI Course
                    </Link>
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
                    © {site.year} {site.author}
                    {site.name ? ` · ${site.name}` : ""} · all systems surveyed
                </p>
            </motion.div>
        </footer>
    );
}

function Planet({
    category: c,
    x,
    y,
    size,
    delay,
    onSelect,
}: {
    category: Category;
    x: string;
    y: string;
    size: number;
    delay: number;
    onSelect: () => void;
}) {
    const locked = c.status !== "live";
    const featured = c.slug === "course";

    return (
        <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease, delay }}
            onClick={onSelect}
            className={cn(
                "ring-focus group absolute -translate-x-1/2 -translate-y-1/2 text-left",
                locked && "opacity-70"
            )}
            style={{ left: x, top: y }}
            aria-label={`${c.title}${locked ? " (soon)" : ""}`}
        >
            <motion.span
                className="relative block"
                animate={{ y: [0, featured ? -8 : -5, 0] }}
                transition={{
                    duration: featured ? 5.5 : 4 + (size % 5) * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-opacity group-hover:opacity-90"
                    style={{
                        width: size * 1.8,
                        height: size * 1.8,
                        background: `radial-gradient(circle, ${c.accent[0]}66, transparent 70%)`,
                        opacity: featured ? 0.85 : 0.55,
                    }}
                />
                <span
                    className={cn(
                        "grid place-items-center rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
                        featured && "ring-2 ring-white/25"
                    )}
                    style={{
                        width: size,
                        height: size,
                        background: `radial-gradient(circle at 30% 28%, ${c.accent[1]}, ${c.accent[0]} 70%)`,
                    }}
                >
                    {locked ? (
                        <Lock className="h-5 w-5 opacity-80" />
                    ) : (
                        <Icon
                            name={c.icon}
                            className={featured ? "h-8 w-8" : "h-6 w-6"}
                        />
                    )}
                </span>
                <span className="mt-2 block text-center">
                    <span className="block font-display text-sm font-bold text-[var(--fg)]">
                        {c.title}
                    </span>
                    {locked && (
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]">
                            soon
                        </span>
                    )}
                </span>
            </motion.span>
        </motion.button>
    );
}

function Starfield({ fixed }: { fixed?: boolean }) {
    const stars = useMemo(
        () =>
            Array.from({ length: 48 }, (_, i) => ({
                id: i,
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                size: 1 + (i % 3),
                delay: (i % 7) * 0.4,
                opacity: 0.25 + (i % 5) * 0.1,
            })),
        []
    );

    return (
        <div
            aria-hidden
            className={cn(
                "pointer-events-none -z-10",
                fixed ? "fixed inset-0" : "absolute inset-0"
            )}
        >
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 90% 70% at 50% 20%, rgba(34,211,238,0.1), transparent 55%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(124,92,255,0.12), transparent 50%), radial-gradient(ellipse 50% 40% at 15% 80%, rgba(244,114,182,0.08), transparent 50%)",
                }}
            />
            {stars.map((s) => (
                <span
                    key={s.id}
                    className="absolute rounded-full bg-white animate-pulse"
                    style={{
                        left: s.left,
                        top: s.top,
                        width: s.size,
                        height: s.size,
                        opacity: s.opacity,
                        animationDelay: `${s.delay}s`,
                        animationDuration: `${3 + (s.id % 4)}s`,
                    }}
                />
            ))}
        </div>
    );
}
