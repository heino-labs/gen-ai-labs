import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search, X } from "lucide-react";
import { categories, posts } from "@/lib/content";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

interface Item {
    type: "category" | "post";
    title: string;
    sub: string;
    href: string;
    icon?: string;
    accent?: [string, string];
}

export function CommandPalette({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const items = useMemo<Item[]>(() => {
        const cat: Item[] = categories.map((c) => ({
            type: "category",
            title: c.title,
            sub: c.short,
            href: `/${c.slug}`,
            icon: c.icon,
            accent: c.accent,
        }));
        const pst: Item[] = posts.map((p) => ({
            type: "post",
            title: p.title,
            sub: p.description,
            href: p.slug,
        }));
        const all = [...cat, ...pst];
        const q = query.trim().toLowerCase();
        if (!q) return all;
        return all.filter(
            (i) =>
                i.title.toLowerCase().includes(q) ||
                i.sub.toLowerCase().includes(q) ||
                i.href.toLowerCase().includes(q)
        );
    }, [query]);

    useEffect(() => {
        if (open) {
            setQuery("");
            setActive(0);
            setTimeout(() => inputRef.current?.focus(), 30);
        }
    }, [open]);

    useEffect(() => setActive(0), [query]);

    const go = (href: string) => {
        onClose();
        router.push(href);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, items.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
        } else if (e.key === "Enter" && items[active]) {
            e.preventDefault();
            go(items[active].href);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="glass relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--card-border)] shadow-glass"
                        onKeyDown={onKeyDown}
                    >
                        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
                            <Search className="h-4 w-4 text-[var(--muted)]" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search guides & categories…"
                                className="h-12 flex-1 bg-transparent text-sm text-[var(--fg)] outline-none placeholder:text-[var(--muted)]"
                            />
                            <button
                                onClick={onClose}
                                className="rounded-md p-1 text-[var(--muted)] hover:text-[var(--fg)]"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="max-h-[52vh] overflow-y-auto p-2">
                            {items.length === 0 && (
                                <p className="px-3 py-8 text-center text-sm text-[var(--muted)]">
                                    No results for “{query}”.
                                </p>
                            )}
                            {items.map((item, i) => (
                                <button
                                    key={`${item.type}-${item.href}-${i}`}
                                    onMouseEnter={() => setActive(i)}
                                    onClick={() => go(item.href)}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                                        i === active
                                            ? "bg-brand/15"
                                            : "hover:bg-white/5"
                                    )}
                                >
                                    <span
                                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white"
                                        style={{
                                            background: item.accent
                                                ? `linear-gradient(135deg, ${item.accent[0]}, ${item.accent[1]})`
                                                : "linear-gradient(135deg,#7c5cff,#22d3ee)",
                                        }}
                                    >
                                        {item.icon ? (
                                            <Icon name={item.icon} className="h-4 w-4" />
                                        ) : (
                                            <span className="text-[11px] font-bold">
                                                {item.title.charAt(0)}
                                            </span>
                                        )}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium text-[var(--fg)]">
                                            {item.title}
                                        </span>
                                        <span className="block truncate text-xs text-[var(--muted)]">
                                            {item.sub}
                                        </span>
                                    </span>
                                    {i === active && (
                                        <CornerDownLeft className="h-3.5 w-3.5 text-[var(--muted)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
