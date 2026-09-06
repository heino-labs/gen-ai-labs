import Link from "next/link";
import { useRouter } from "next/router";
import { categories, postsByCategory } from "@/lib/content";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

/**
 * Doc sidebar — same interaction model as Course:
 * Category → expand guides → open guide → prev/next.
 * Course track is linked out (has its own shell).
 */
export function Sidebar({
    activeCategory,
    mobile = false,
}: {
    activeCategory?: string;
    mobile?: boolean;
}) {
    const router = useRouter();
    const current = router.asPath.split("#")[0].replace(/\/$/, "") || "/";

    const docCategories = categories.filter((c) => c.slug !== "course");

    if (mobile) {
        return (
            <div className="space-y-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {docCategories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/${cat.slug}`}
                            className={cn(
                                "shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium",
                                cat.slug === activeCategory
                                    ? "border-brand/40 bg-brand/10 text-brand"
                                    : "border-[var(--border)] text-[var(--muted)]"
                            )}
                        >
                            {cat.title}
                        </Link>
                    ))}
                    <Link
                        href="/course"
                        className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] text-[var(--muted)]"
                    >
                        AI Course
                    </Link>
                </div>
                {activeCategory &&
                    postsByCategory(activeCategory).map((post) => (
                        <Link
                            key={post.slug}
                            href={post.slug}
                            className={cn(
                                "mr-2 inline-flex rounded-lg border px-2.5 py-1 text-[11px]",
                                current === post.slug
                                    ? "border-brand/40 bg-brand/10 text-brand"
                                    : "border-[var(--border)] text-[var(--muted)]"
                            )}
                        >
                            {post.title}
                        </Link>
                    ))}
            </div>
        );
    }

    return (
        <nav className="text-[13px]">
            <Link
                href="/course"
                className="mb-3 flex items-center gap-2.5 rounded-lg px-2 py-2 text-[var(--fg-soft)] transition-colors hover:bg-[var(--card)] hover:text-[var(--fg)]"
            >
                <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-white"
                    style={{
                        background: "linear-gradient(135deg, #22d3ee, #f472b6)",
                    }}
                >
                    <Icon name="Sparkles" className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium">AI BA/Tester Course</span>
            </Link>

            <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                khoá học
            </p>

            {docCategories.map((cat) => {
                const items = postsByCategory(cat.slug);
                const isActiveCat = cat.slug === activeCategory;
                const soon = cat.status === "soon";

                return (
                    <div key={cat.slug} className="mb-0.5">
                        <Link
                            href={`/${cat.slug}`}
                            className={cn(
                                "group flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors",
                                isActiveCat
                                    ? "bg-[var(--card)] font-medium text-[var(--fg)]"
                                    : "text-[var(--fg-soft)] hover:bg-[var(--card)] hover:text-[var(--fg)]"
                            )}
                        >
                            <span
                                className={cn(
                                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-white",
                                    soon && "opacity-60"
                                )}
                                style={{
                                    background: `linear-gradient(135deg, ${cat.accent[0]}, ${cat.accent[1]})`,
                                }}
                            >
                                <Icon name={cat.icon} className="h-3.5 w-3.5" />
                            </span>
                            <span className="min-w-0 flex-1 leading-snug">
                                <span className="block truncate">{cat.title}</span>
                                {soon && (
                                    <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]">
                                        soon
                                    </span>
                                )}
                            </span>
                        </Link>

                        {/* Guides only when this track is open — same as Course lessons */}
                        {isActiveCat && items.length > 0 && (
                            <ul className="relative ml-[18px] mt-1 space-y-0.5 border-l border-[var(--border)] pl-3">
                                {items.map((post) => {
                                    const active = current === post.slug;
                                    return (
                                        <li key={post.slug}>
                                            <Link
                                                href={post.slug}
                                                className={cn(
                                                    "block rounded-md px-2 py-1.5 text-[12px] leading-snug transition-colors",
                                                    active
                                                        ? "bg-brand/10 font-medium text-brand"
                                                        : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--fg)]"
                                                )}
                                            >
                                                {post.title}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
