import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Command, Github, Menu, Search, X } from "lucide-react";
import { categories } from "@/lib/content";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandPalette } from "@/components/ui/command-palette";
import { cn } from "@/lib/cn";

export function Navbar({ dock }: { dock?: boolean } = {}) {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const shellDock =
        dock === true ||
        router.pathname.startsWith("/course/") ||
        (router.pathname !== "/" &&
            router.pathname !== "/course" &&
            !router.pathname.startsWith("/components"));

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setPaletteOpen((v) => !v);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => setMobileOpen(false), [router.asPath]);

    const brand = (
        <Link
            href="/"
            className="ring-focus group flex min-w-0 items-center gap-2.5 rounded-xl"
        >
            <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-aurora-grad text-white shadow-glow">
                <span className="absolute inset-0 animate-gradient-x bg-aurora-grad opacity-90 [background-size:200%_200%]" />
                <span className="relative font-display text-sm font-black">A</span>
            </span>
            <span className="flex min-w-0 flex-col leading-none">
                <span className="truncate font-display text-base font-extrabold tracking-tight text-[var(--fg)]">
                    {site.name || site.tagline}
                </span>
                {site.name ? (
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                        {site.tagline}
                    </span>
                ) : null}
            </span>
        </Link>
    );

    const centerNav = (
        <div className="hidden items-center gap-1 md:flex">
            <Link
                href="/course"
                className={cn(
                    "ring-focus flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    router.asPath.startsWith("/course")
                        ? "text-[var(--fg)]"
                        : "text-[var(--muted)] hover:text-[var(--fg)]"
                )}
            >
                <Icon name="Sparkles" className="h-3.5 w-3.5" />
                AI Course
            </Link>
            {categories
                .filter((c) => c.slug !== "course")
                .map((c) => {
                    const activeCat = router.asPath.startsWith(`/${c.slug}`);
                    return (
                        <Link
                            key={c.slug}
                            href={`/${c.slug}`}
                            className={cn(
                                "ring-focus flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                                activeCat
                                    ? "text-[var(--fg)]"
                                    : "text-[var(--muted)] hover:text-[var(--fg)]"
                            )}
                        >
                            <Icon name={c.icon} className="h-3.5 w-3.5" />
                            {c.title}
                            {c.status === "soon" && (
                                <span className="rounded bg-white/5 px-1 text-[9px] uppercase text-[var(--muted)]">
                                    soon
                                </span>
                            )}
                        </Link>
                    );
                })}
        </div>
    );

    const actions = (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setPaletteOpen(true)}
                className="ring-focus glass hidden items-center gap-2 rounded-xl px-3 py-2 text-xs text-[var(--muted)] transition-colors hover:text-[var(--fg)] sm:flex"
            >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
                <kbd className="flex items-center gap-0.5 rounded border border-[var(--border)] px-1 py-0.5 text-[10px]">
                    <Command className="h-2.5 w-2.5" />K
                </kbd>
            </button>
            <button
                onClick={() => setPaletteOpen(true)}
                aria-label="Search"
                className="ring-focus glass grid h-9 w-9 place-items-center rounded-xl text-[var(--muted)] sm:hidden"
            >
                <Search className="h-[18px] w-[18px]" />
            </button>

            <ThemeToggle />

            <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="ring-focus glass hidden h-9 w-9 place-items-center rounded-xl text-[var(--fg)] transition-colors hover:text-brand sm:grid"
            >
                <Github className="h-[18px] w-[18px]" />
            </a>

            <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Menu"
                className="ring-focus glass grid h-9 w-9 place-items-center rounded-xl text-[var(--fg)] md:hidden"
            >
                {mobileOpen ? (
                    <X className="h-[18px] w-[18px]" />
                ) : (
                    <Menu className="h-[18px] w-[18px]" />
                )}
            </button>
        </div>
    );

    return (
        <>
            <header
                className={cn(
                    "fixed inset-x-0 top-0 z-50 transition-all duration-300",
                    scrolled
                        ? "border-b border-[var(--border)] bg-[var(--bg)]/70 backdrop-blur-xl"
                        : "border-b border-[var(--border)]/60 bg-[var(--bg)]/50 backdrop-blur-xl"
                )}
            >
                {shellDock ? (
                    <nav className="flex h-16 w-full items-stretch">
                        <div className="hidden w-[280px] shrink-0 items-center border-r border-[var(--border)] bg-[var(--bg-soft)]/40 px-4 lg:flex">
                            {brand}
                        </div>
                        <div className="flex flex-1 items-center justify-between gap-4 px-4 sm:px-6">
                            <div className="lg:hidden">{brand}</div>
                            {centerNav}
                            {actions}
                        </div>
                    </nav>
                ) : (
                    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        {brand}
                        {centerNav}
                        {actions}
                    </nav>
                )}

                {mobileOpen && (
                    <div className="border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-xl md:hidden">
                        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-4">
                            {categories.map((c) => (
                                <Link
                                    key={c.slug}
                                    href={c.slug === "course" ? "/course" : `/${c.slug}`}
                                    className="glass flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--fg)]"
                                >
                                    <span
                                        className="grid h-7 w-7 place-items-center rounded-lg text-white"
                                        style={{
                                            background: `linear-gradient(135deg, ${c.accent[0]}, ${c.accent[1]})`,
                                        }}
                                    >
                                        <Icon name={c.icon} className="h-3.5 w-3.5" />
                                    </span>
                                    {c.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        </>
    );
}
