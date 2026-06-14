import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight, Clock, CalendarDays, Github } from "lucide-react";
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

export function DocLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const path = router.asPath.split("#")[0].replace(/\/$/, "") || "/";

    const category = getCategoryForPath(path);
    const post = getPost(path);
    const { prev, next } = getAdjacent(path);

    return (
        <div className="relative min-h-screen">
            <ScrollProgress />
            <Navbar />

            <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[230px_minmax(0,1fr)_220px]">
                    {/* Left: sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border-r border-[var(--border)] pr-5">
                            <Sidebar activeCategory={category?.slug} />
                        </div>
                    </aside>

                    {/* Center: article */}
                    <article className="min-w-0">
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

                        <div className="prose-doc animate-fade-up">{children}</div>

                        {/* Prev / Next */}
                        {(prev || next) && (
                            <nav className="mt-14 grid gap-4 sm:grid-cols-2">
                                {prev ? (
                                    <Link
                                        href={prev.slug}
                                        className="glass card-hover group flex flex-col gap-1 rounded-2xl p-4"
                                    >
                                        <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                                            <ArrowLeft className="h-3.5 w-3.5" /> Previous
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
                                            Next <ArrowRight className="h-3.5 w-3.5" />
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
                                <Github className="h-3.5 w-3.5" /> Edit this page on GitHub
                            </a>
                        </div>
                    </article>

                    {/* Right: TOC */}
                    <aside className="hidden xl:block">
                        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                            <Toc />
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />
        </div>
    );
}
