import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import {
    courseMeta,
    tiers,
    modules,
    lessonEngine,
    modulesByTier,
} from "@/lib/curriculum";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

export function CoursePathPage() {
    const first = modules[0];

    return (
        <>
            <Head>
                <title>{`${courseMeta.title} — Lộ trình`}</title>
                <meta name="description" content={courseMeta.description} />
            </Head>

            <header className="fixed right-4 top-4 z-30 flex items-center gap-2">
                <Link
                    href="/"
                    className="glass ring-focus rounded-xl px-3 py-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--fg)]"
                >
                    Codex
                </Link>
                <span className="glass">
                    <ThemeToggle />
                </span>
            </header>

            <main className="relative">
                {/* Hero — one composition */}
                <section className="relative min-h-[100svh] overflow-hidden px-4 pb-16 pt-24 sm:px-6 lg:px-8">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10"
                        style={{
                            background:
                                "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,238,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 40%, rgba(244,114,182,0.12), transparent 50%), radial-gradient(ellipse 40% 50% at 10% 60%, rgba(124,92,255,0.14), transparent 50%)",
                        }}
                    />
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 bg-grid-fade opacity-30 [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
                    />

                    <div className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-5xl flex-col justify-center">
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease }}
                            className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-aurora-cyan"
                        >
                            {courseMeta.title}
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease, delay: 0.05 }}
                            className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[1.05] tracking-tight text-[var(--fg)]"
                        >
                            Không học theo Tool.
                            <span className="mt-2 block text-gradient">
                                Học theo Problem.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, ease, delay: 0.12 }}
                            className="mt-6 max-w-xl text-lg text-[var(--fg-soft)]"
                        >
                            {courseMeta.description}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, ease, delay: 0.18 }}
                            className="mt-10 flex flex-wrap items-center gap-3"
                        >
                            <Link
                                href={`/course/${first.slug}`}
                                className="ring-focus group inline-flex items-center gap-2 rounded-xl bg-aurora-grad px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
                            >
                                Bắt đầu Module {first.number}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <a
                                href="#path"
                                className="ring-focus glass inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium text-[var(--fg)]"
                            >
                                Xem lộ trình
                                <ArrowDown className="h-4 w-4" />
                            </a>
                        </motion.div>

                        <motion.dl
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35, duration: 0.6 }}
                            className="mt-14 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]"
                        >
                            <div>
                                <dt className="inline text-[var(--muted)]">Cách học · </dt>
                                <dd className="inline text-[var(--fg-soft)]">
                                    {courseMeta.approach}
                                </dd>
                            </div>
                            <div>
                                <dt className="inline">Tool · </dt>
                                <dd className="inline text-[var(--fg-soft)]">
                                    {courseMeta.tool}
                                </dd>
                            </div>
                            <div>
                                <dt className="inline">Đối tượng · </dt>
                                <dd className="inline text-[var(--fg-soft)]">
                                    {courseMeta.audience}
                                </dd>
                            </div>
                        </motion.dl>
                    </div>
                </section>

                {/* 3 tiers */}
                <section className="border-t border-[var(--border)] px-4 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                            3 tầng — không hơn
                        </p>
                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {tiers.map((t, i) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.45, ease, delay: i * 0.08 }}
                                    className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/40 p-6"
                                >
                                    <span className="font-display text-4xl font-black text-[var(--fg)]/10">
                                        0{t.number}
                                    </span>
                                    <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-[var(--fg)]">
                                        {t.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-[var(--muted)]">
                                        {t.subtitle}
                                    </p>
                                    <p className="mt-4 font-mono text-[10px] text-aurora-cyan">
                                        {modulesByTier(t.id)
                                            .map((m) => m.number)
                                            .join(" · ")}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Path */}
                <section id="path" className="px-4 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                            Lộ trình 8 module
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[var(--fg)]">
                            Từ hiểu AI đến evidence pack
                        </h2>

                        <ol className="relative mt-12 space-y-0">
                            <span
                                aria-hidden
                                className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-aurora-cyan via-aurora-violet to-aurora-amber"
                            />
                            {modules.map((m, i) => (
                                <motion.li
                                    key={m.slug}
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-30px" }}
                                    transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                                    className="relative pb-8 pl-14 last:pb-0"
                                >
                                    <span
                                        className="absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-xl text-white shadow-glow"
                                        style={{
                                            background: `linear-gradient(135deg, ${m.accent[0]}, ${m.accent[1]})`,
                                        }}
                                    >
                                        <Icon name={m.icon} className="h-4 w-4" />
                                    </span>
                                    <Link
                                        href={`/course/${m.slug}`}
                                        className={cn(
                                            "group block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 transition-colors",
                                            "hover:border-[rgba(124,92,255,0.35)]"
                                        )}
                                    >
                                        <div className="flex flex-wrap items-baseline gap-2">
                                            <span className="font-mono text-xs text-[var(--muted)]">
                                                MODULE {m.number}
                                            </span>
                                            <span className="rounded-md border border-[var(--border)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]">
                                                {m.tier}
                                            </span>
                                            <span className="font-mono text-[9px] text-[var(--muted)]">
                                                {m.lessons} lessons
                                            </span>
                                        </div>
                                        <h3 className="mt-1.5 font-display text-lg font-bold text-[var(--fg)] group-hover:text-brand">
                                            {m.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-[var(--muted)]">
                                            {m.short}
                                        </p>
                                        <p className="mt-3 text-xs text-[var(--fg-soft)]">
                                            <span className="text-[var(--muted)]">Output · </span>
                                            {m.output}
                                        </p>
                                    </Link>
                                </motion.li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* Lesson engine */}
                <section className="border-t border-[var(--border)] px-4 py-20 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                            Lesson engine
                        </p>
                        <h2 className="mt-3 font-display text-2xl font-bold text-[var(--fg)]">
                            Mọi bài học cùng một công thức
                        </h2>
                        <div className="mt-8 flex flex-wrap gap-2">
                            {lessonEngine.map((step, i) => (
                                <span
                                    key={step}
                                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)]/50 px-3 py-2 font-mono text-[11px] text-[var(--fg-soft)]"
                                >
                                    <span className="text-[var(--muted)]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    {step}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-4 pb-28 sm:px-6 lg:px-8">
                    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--card-border)] px-8 py-14 text-center sm:px-16">
                        <div className="absolute inset-0 -z-10 bg-aurora-grad opacity-[0.12]" />
                        <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-extrabold text-[var(--fg)]">
                            Bắt đầu từ nền tảng AI
                        </h2>
                        <p className="mx-auto mt-3 max-w-lg text-[var(--fg-soft)]">
                            Module 02 · Ví dụ đời thường · Measurement xuyên suốt.
                        </p>
                        <Link
                            href={`/course/${first.slug}`}
                            className="ring-focus group mt-8 inline-flex items-center gap-2 rounded-xl bg-aurora-grad px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
                        >
                            Vào Module {first.number}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
