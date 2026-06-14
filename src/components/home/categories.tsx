import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import { categories, postsByCategory } from "@/lib/content";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

// bento span pattern (index-based)
const spans = [
    "md:col-span-3 md:row-span-2",
    "md:col-span-3",
    "md:col-span-2",
    "md:col-span-2",
    "md:col-span-2",
    "md:col-span-3",
    "md:col-span-3",
];

export function Categories() {
    return (
        <section id="categories" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeading
                eyebrow="Explore"
                title="Pick a track, go deep"
                sub="Every category is a curated path of hands-on guides. New tracks land regularly."
            />

            <div className="mt-12 grid auto-rows-[minmax(150px,auto)] grid-cols-2 gap-4 md:grid-cols-6">
                {categories.map((cat, i) => {
                    const count = postsByCategory(cat.slug).length;
                    const live = cat.status === "live";
                    const big = i === 0;

                    const inner = (
                        <>
                            <div
                                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
                                style={{
                                    background: `radial-gradient(circle, ${cat.accent[0]}, transparent 70%)`,
                                }}
                            />
                            <div className="relative flex h-full flex-col">
                                <div className="flex items-start justify-between">
                                    <span
                                        className={cn(
                                            "grid place-items-center rounded-2xl text-white shadow-lg",
                                            big ? "h-14 w-14" : "h-11 w-11"
                                        )}
                                        style={{
                                            background: `linear-gradient(135deg, ${cat.accent[0]}, ${cat.accent[1]})`,
                                        }}
                                    >
                                        <Icon
                                            name={cat.icon}
                                            className={big ? "h-7 w-7" : "h-5 w-5"}
                                        />
                                    </span>
                                    {live ? (
                                        <ArrowUpRight className="h-5 w-5 text-[var(--muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                                    ) : (
                                        <span className="flex items-center gap-1 rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                                            <Lock className="h-2.5 w-2.5" /> soon
                                        </span>
                                    )}
                                </div>

                                <h3
                                    className={cn(
                                        "mt-4 font-display font-bold text-[var(--fg)]",
                                        big ? "text-2xl" : "text-lg"
                                    )}
                                >
                                    {cat.title}
                                </h3>
                                <p
                                    className={cn(
                                        "mt-1.5 text-sm leading-relaxed text-[var(--muted)]",
                                        big ? "max-w-md" : "line-clamp-2"
                                    )}
                                >
                                    {big ? cat.description : cat.short}
                                </p>

                                <div className="mt-auto flex items-center gap-2 pt-4">
                                    {live && (
                                        <span className="text-xs font-medium text-[var(--fg-soft)]">
                                            {count} {count === 1 ? "guide" : "guides"}
                                        </span>
                                    )}
                                    <div className="flex flex-wrap gap-1.5">
                                        {cat.tags.slice(0, big ? 3 : 2).map((t) => (
                                            <span
                                                key={t}
                                                className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-[var(--muted)]"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    );

                    return (
                        <motion.div
                            key={cat.slug}
                            initial={{ opacity: 0, y: 26 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.55, ease, delay: (i % 3) * 0.06 }}
                            className={cn("col-span-1", spans[i] ?? "md:col-span-2")}
                        >
                            {live ? (
                                <Link
                                    href={`/${cat.slug}`}
                                    className="glass card-hover ring-focus group relative block h-full overflow-hidden rounded-3xl p-5"
                                >
                                    {inner}
                                </Link>
                            ) : (
                                <div className="glass group relative block h-full overflow-hidden rounded-3xl p-5 opacity-80">
                                    {inner}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}

export function SectionHeading({
    eyebrow,
    title,
    sub,
}: {
    eyebrow: string;
    title: string;
    sub?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease }}
            className="max-w-2xl"
        >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
                {eyebrow}
            </span>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold leading-tight tracking-tight text-[var(--fg)]">
                {title}
            </h2>
            {sub && (
                <p className="mt-3 text-[var(--fg-soft)]">{sub}</p>
            )}
        </motion.div>
    );
}
