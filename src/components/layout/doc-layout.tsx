import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    CalendarDays,
    Github,
    Home,
} from "lucide-react";
import {
    getAdjacent,
    getCategoryForPath,
    getPost,
} from "@/lib/content";
import { site } from "@/lib/site";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/sidebar";
import { Toc } from "@/components/layout/toc";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { CategoryBadge, Pill } from "@/components/ui/category-badge";

/**
 * Shared knowledge-shell for Setup / Linux / DevOps / …
 * Same chrome as Course: flush-left sidebar, brand docked in navbar, wide content.
 */
export function DocLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const path = router.asPath.split("#")[0].replace(/\/$/, "") || "/";

    const category = getCategoryForPath(path);
    const post = getPost(path);
    const { prev, next } = getAdjacent(path);

    return (
        <div className="relative min-h-screen">
            <ScrollProgress />
            <Navbar dock />

            <div className="pt-16 lg:flex lg:min-h-[calc(100vh-4rem)]">
                <aside className="hidden w-[280px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-soft)]/40 lg:block">
                    <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto px-3 py-5">
                        <Link
                            href="/"
                            className="mb-4 flex items-center gap-2 px-2 text-xs font-semibold text-brand"
                        >
                            <Home className="h-3.5 w-3.5" />
                            Về vũ trụ kiến thức
                        </Link>
                        <Sidebar activeCategory={category?.slug} />
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    <div className="lg:flex">
                        <article className="min-w-0 flex-1 px-5 py-10 sm:px-8 lg:max-w-5xl lg:px-12 lg:py-12">
                            {/* Mobile category / post chips */}
                            <div className="mb-6 lg:hidden">
                                <Sidebar
                                    activeCategory={category?.slug}
                                    mobile
                                />
                            </div>

                            <header className="mb-8 animate-fade-up">
                                <Breadcrumbs category={category} post={post} />
                                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                                    {category && (
                                        <CategoryBadge
                                            label={category.title}
                                            accent={category.accent}
                                        />
                                    )}
                                    {post && (
                                        <>
                                            <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                                                <Clock className="h-3.5 w-3.5" />
                                                {post.readingTime}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                {post.updated}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {post?.tags && post.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {post.tags.map((t) => (
                                            <Pill key={t}>#{t}</Pill>
                                        ))}
                                    </div>
                                )}
                            </header>

                            <div className="prose-doc animate-fade-up">
                                {children}
                            </div>

                            {(prev || next) && (
                                <nav className="mt-14 grid gap-4 sm:grid-cols-2">
                                    {prev ? (
                                        <Link
                                            href={prev.slug}
                                            className="glass card-hover group flex flex-col gap-1 rounded-2xl p-4"
                                        >
                                            <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                                                <ArrowLeft className="h-3.5 w-3.5" />{" "}
                                                Trước
                                            </span>
                                            <span className="font-medium text-[var(--fg)] group-hover:text-brand">
                                                {prev.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <span />
                                    )}
                                    {next && (
                                        <Link
                                            href={next.slug}
                                            className="glass card-hover group flex flex-col items-end gap-1 rounded-2xl p-4 text-right sm:col-start-2"
                                        >
                                            <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                                                Tiếp{" "}
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </span>
                                            <span className="font-medium text-[var(--fg)] group-hover:text-brand">
                                                {next.title}
                                            </span>
                                        </Link>
                                    )}
                                </nav>
                            )}

                            <div className="mt-10 border-t border-[var(--border)] pt-6">
                                <a
                                    href={site.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] transition-colors hover:text-brand"
                                >
                                    <Github className="h-3.5 w-3.5" /> Edit on
                                    GitHub
                                </a>
                            </div>
                        </article>

                        <aside className="hidden w-[220px] shrink-0 xl:block">
                            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto py-12 pr-6">
                                <Toc />
                            </div>
                        </aside>
                    </div>

                    <Footer />
                </div>
            </div>
        </div>
    );
}
