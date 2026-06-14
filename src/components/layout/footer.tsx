import Link from "next/link";
import { Github, Heart } from "lucide-react";
import { categories } from "@/lib/content";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/icon";

export function Footer() {
    return (
        <footer className="relative mt-24 border-t border-[var(--border)]">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
                    <div>
                        <Link href="/" className="flex items-center gap-2.5">
                            <span className="grid h-9 w-9 place-items-center rounded-xl bg-aurora-grad text-white shadow-glow">
                                <span className="font-display text-sm font-black">A</span>
                            </span>
                            <span className="font-display text-base font-extrabold text-[var(--fg)]">
                                {site.name}
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
                            {site.description}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                            Categories
                        </h4>
                        <ul className="mt-4 space-y-2.5">
                            {categories.slice(0, 5).map((c) => (
                                <li key={c.slug}>
                                    <Link
                                        href={`/${c.slug}`}
                                        className="flex items-center gap-2 text-sm text-[var(--fg-soft)] transition-colors hover:text-brand"
                                    >
                                        <Icon name={c.icon} className="h-3.5 w-3.5" />
                                        {c.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                            Coming soon
                        </h4>
                        <ul className="mt-4 space-y-2.5">
                            {categories
                                .filter((c) => c.status === "soon")
                                .map((c) => (
                                    <li
                                        key={c.slug}
                                        className="flex items-center gap-2 text-sm text-[var(--muted)]"
                                    >
                                        <Icon name={c.icon} className="h-3.5 w-3.5" />
                                        {c.title}
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row">
                    <p className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                        MIT License · © {site.year} {site.name} · built with
                        <Heart className="h-3 w-3 fill-aurora-pink text-aurora-pink" />
                    </p>
                    <a
                        href={site.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[var(--muted)] transition-colors hover:text-brand"
                    >
                        <Github className="h-3.5 w-3.5" /> {site.author}
                    </a>
                </div>
            </div>
        </footer>
    );
}
