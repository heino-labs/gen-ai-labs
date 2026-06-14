import Link from "next/link";
import { useRouter } from "next/router";
import { categories, postsByCategory } from "@/lib/content";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function Sidebar({ activeCategory }: { activeCategory?: string }) {
    const router = useRouter();
    const current = router.asPath.split("#")[0].replace(/\/$/, "") || "/";

    return (
        <nav className="text-[13.5px]">
            {categories.map((cat) => {
                const items = postsByCategory(cat.slug);
                const isActiveCat = cat.slug === activeCategory;
                const soon = cat.status === "soon";

                return (
                    <div key={cat.slug} className="py-1.5 first:pt-0">
                        {/* category header */}
                        <Link
                            href={`/${cat.slug}`}
                            className={cn(
                                "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 font-semibold transition-colors",
                                isActiveCat
                                    ? "text-[var(--fg)]"
                                    : "text-[var(--fg)]/90 hover:text-[var(--fg)]"
                            )}
                        >
                            <span
                                className={cn(
                                    "grid h-[26px] w-[26px] shrink-0 place-items-center rounded-[9px] text-white transition-transform group-hover:scale-105",
                                    !isActiveCat && cat.status === "live" && "opacity-95",
                                    soon && "opacity-70"
                                )}
                                style={{
                                    background: `linear-gradient(135deg, ${cat.accent[0]}, ${cat.accent[1]})`,
                                }}
                            >
                                <Icon name={cat.icon} className="h-[15px] w-[15px]" />
                            </span>
                            <span className="truncate">{cat.title}</span>
                            {soon && (
                                <span className="ml-auto shrink-0 rounded-full border border-[var(--border)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                                    soon
                                </span>
                            )}
                        </Link>

                        {/* posts — single continuous rail aligned under the icon centre */}
                        {items.length > 0 && (
                            <ul className="relative ml-[15px] mt-1 pl-[18px]">
                                <span
                                    aria-hidden
                                    className="absolute left-0 top-1.5 bottom-1.5 w-px bg-[var(--border)]"
                                />
                                {items.map((post) => {
                                    const active = current === post.slug;
                                    return (
                                        <li key={post.slug} className="relative">
                                            <Link
                                                href={post.slug}
                                                className={cn(
                                                    "relative block truncate rounded-md px-2.5 py-[7px] transition-colors",
                                                    active
                                                        ? "font-medium text-brand"
                                                        : "text-[var(--fg-soft)] hover:bg-[var(--card)] hover:text-[var(--fg)]"
                                                )}
                                            >
                                                {active && (
                                                    <span className="absolute -left-[18px] top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-gradient-to-b from-aurora-violet to-aurora-cyan" />
                                                )}
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
