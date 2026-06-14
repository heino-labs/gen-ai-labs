import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/content";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/home/categories";

const ease = [0.22, 1, 0.36, 1] as const;

export function Roadmap() {
    const upcoming = categories.filter((c) => c.status === "soon");

    return (
        <section id="roadmap" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <SectionHeading
                eyebrow="Roadmap"
                title="More tracks on the way"
                sub="The codex keeps expanding — here is what is brewing next."
            />

            <div className="relative mt-12">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-aurora-violet/60 via-aurora-cyan/40 to-transparent md:left-1/2" />
                <div className="space-y-6">
                    {upcoming.map((cat, i) => (
                        <motion.div
                            key={cat.slug}
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, ease, delay: i * 0.05 }}
                            className="relative flex items-start gap-4 md:grid md:grid-cols-2 md:gap-10"
                        >
                            <span
                                className="absolute left-0 top-1.5 z-10 grid h-8 w-8 place-items-center rounded-full text-white ring-4 ring-[var(--bg)] md:left-1/2 md:-translate-x-1/2"
                                style={{
                                    background: `linear-gradient(135deg, ${cat.accent[0]}, ${cat.accent[1]})`,
                                }}
                            >
                                <Icon name={cat.icon} className="h-4 w-4" />
                            </span>
                            <div
                                className={
                                    i % 2 === 0
                                        ? "glass ml-12 rounded-2xl p-5 md:ml-0 md:mr-12 md:text-right"
                                        : "glass ml-12 rounded-2xl p-5 md:col-start-2 md:ml-12"
                                }
                            >
                                <h3 className="font-display text-lg font-bold text-[var(--fg)]">
                                    {cat.title}
                                </h3>
                                <p className="mt-1 text-sm text-[var(--muted)]">
                                    {cat.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA band */}
            <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease }}
                className="relative mt-20 overflow-hidden rounded-[2rem] border border-[var(--card-border)] p-10 text-center sm:p-16"
            >
                <div className="absolute inset-0 -z-10 bg-aurora-grad opacity-[0.14]" />
                <div className="absolute inset-0 -z-10 bg-grid-fade [background-size:36px_36px] opacity-40" />
                <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-tight tracking-tight text-[var(--fg)]">
                    Ready to build something real?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-[var(--fg-soft)]">
                    Spin up a fresh Ubuntu lab and follow along. No setup fatigue —
                    just copy, paste, and learn.
                </p>
                <Link
                    href="/setup"
                    className="ring-focus group mt-8 inline-flex items-center gap-2 rounded-xl bg-aurora-grad px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
                >
                    Begin the journey
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </motion.div>
        </section>
    );
}
