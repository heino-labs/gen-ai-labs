import type { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import type { CourseModule } from "@/lib/curriculum";
import { courseMeta } from "@/lib/curriculum";
import type { SidebarModule } from "@/lib/curriculum-load";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Icon } from "@/components/ui/icon";
import { MermaidRenderer } from "@/components/ui/mermaid-renderer";
import { cn } from "@/lib/cn";

type NavTarget = {
    href: string;
    label: string;
    sub?: string;
} | null;

export function CourseShell({
    module,
    sidebar,
    activeLessonSlug,
    title,
    description,
    children,
    prev,
    next,
}: {
    module: CourseModule;
    sidebar: SidebarModule[];
    activeLessonSlug?: string | null;
    title: string;
    description?: string;
    children: ReactNode;
    prev?: NavTarget;
    next?: NavTarget;
}) {
    return (
        <div className="relative min-h-screen">
            <Head>
                <title>{`${title} — ${courseMeta.title}`}</title>
                {description ? (
                    <meta name="description" content={description} />
                ) : null}
            </Head>
            <ScrollProgress />
            <Navbar dock />

            <div className="pt-16 lg:flex lg:min-h-[calc(100vh-4rem)]">
                <aside className="hidden w-[280px] shrink-0 border-r border-[var(--border)] bg-[var(--bg-soft)]/40 lg:block">
                    <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto px-3 py-5">
                        <Link
                            href="/course"
                            className="mb-4 flex items-center gap-2 px-2 text-xs font-semibold text-brand"
                        >
                            <BookOpen className="h-3.5 w-3.5" />
                            Lộ trình khoá học
                        </Link>

                        <nav className="space-y-1">
                            {sidebar.map((m) => {
                                const open = m.slug === module.slug;
                                return (
                                    <div key={m.slug}>
                                        <Link
                                            href={`/course/${m.slug}`}
                                            className={cn(
                                                "flex items-start gap-2.5 rounded-lg px-2 py-2 text-[13px] transition-colors",
                                                open
                                                    ? "bg-[var(--card)] font-medium text-[var(--fg)]"
                                                    : "text-[var(--fg-soft)] hover:bg-[var(--card)] hover:text-[var(--fg)]"
                                            )}
                                        >
                                            <span
                                                className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md text-[10px] font-bold text-white"
                                                style={{
                                                    background: `linear-gradient(135deg, ${m.accent[0]}, ${m.accent[1]})`,
                                                }}
                                            >
                                                {m.number}
                                            </span>
                                            <span className="leading-snug">
                                                {m.title}
                                            </span>
                                        </Link>

                                        {open && m.lessons.length > 0 && (
                                            <ul className="relative ml-[18px] mt-1 space-y-0.5 border-l border-[var(--border)] pl-3">
                                                {m.lessons.map((les) => {
                                                    const active =
                                                        les.slug ===
                                                        activeLessonSlug;
                                                    return (
                                                        <li key={les.slug}>
                                                            <Link
                                                                href={les.href}
                                                                className={cn(
                                                                    "block rounded-md px-2 py-1.5 text-[12px] leading-snug transition-colors",
                                                                    active
                                                                        ? "bg-brand/10 font-medium text-brand"
                                                                        : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--fg)]"
                                                                )}
                                                            >
                                                                <span className="font-mono text-[10px] text-[var(--muted)]">
                                                                    {les.id}
                                                                </span>
                                                                <span className="mt-0.5 block">
                                                                    {les.title}
                                                                </span>
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
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    <article className="w-full max-w-5xl px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
                        <div className="mb-6 space-y-3 lg:hidden">
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {sidebar.map((m) => (
                                    <Link
                                        key={m.slug}
                                        href={`/course/${m.slug}`}
                                        className={cn(
                                            "shrink-0 rounded-full border px-3 py-1 font-mono text-[11px]",
                                            m.slug === module.slug
                                                ? "border-brand/40 bg-brand/10 text-brand"
                                                : "border-[var(--border)] text-[var(--muted)]"
                                        )}
                                    >
                                        M{m.number}
                                    </Link>
                                ))}
                            </div>
                            {sidebar
                                .find((m) => m.slug === module.slug)
                                ?.lessons.map((les) => (
                                    <Link
                                        key={les.slug}
                                        href={les.href}
                                        className={cn(
                                            "mr-2 inline-flex rounded-lg border px-2.5 py-1 text-[11px]",
                                            les.slug === activeLessonSlug
                                                ? "border-brand/40 bg-brand/10 text-brand"
                                                : "border-[var(--border)] text-[var(--muted)]"
                                        )}
                                    >
                                        {les.id}
                                    </Link>
                                ))}
                        </div>

                        {children}

                        <MermaidRenderer />

                        {(prev || next) && (
                            <nav className="mt-14 grid gap-4 sm:grid-cols-2">
                                {prev ? (
                                    <Link
                                        href={prev.href}
                                        className="glass card-hover group flex flex-col gap-1 rounded-2xl p-4"
                                    >
                                        <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                                            <ArrowLeft className="h-3.5 w-3.5" />{" "}
                                            Trước
                                        </span>
                                        <span className="font-medium text-[var(--fg)] group-hover:text-brand">
                                            {prev.label}
                                        </span>
                                        {prev.sub && (
                                            <span className="text-xs text-[var(--muted)]">
                                                {prev.sub}
                                            </span>
                                        )}
                                    </Link>
                                ) : (
                                    <span />
                                )}
                                {next && (
                                    <Link
                                        href={next.href}
                                        className="glass card-hover group flex flex-col items-end gap-1 rounded-2xl p-4 text-right sm:col-start-2"
                                    >
                                        <span className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                                            Tiếp{" "}
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </span>
                                        <span className="font-medium text-[var(--fg)] group-hover:text-brand">
                                            {next.label}
                                        </span>
                                        {next.sub && (
                                            <span className="text-xs text-[var(--muted)]">
                                                {next.sub}
                                            </span>
                                        )}
                                    </Link>
                                )}
                            </nav>
                        )}
                    </article>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export function ModuleOverviewBody({
    module,
    overviewHtml,
    lessons,
}: {
    module: CourseModule;
    overviewHtml: string;
    lessons: { id: string; slug: string; title: string; href: string }[];
}) {
    return (
        <>
            <header className="mb-8 animate-fade-up">
                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                        style={{
                            background: `linear-gradient(135deg, ${module.accent[0]}, ${module.accent[1]})`,
                        }}
                    >
                        <Icon name={module.icon} className="h-3.5 w-3.5" />
                        Module {module.number}
                    </span>
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                        {module.tier}
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                        {lessons.length} lessons
                    </span>
                </div>
                <h1 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold tracking-tight text-[var(--fg)]">
                    {module.title}
                </h1>
                <p className="mt-3 max-w-2xl text-[var(--fg-soft)]">
                    {module.goal}
                </p>
                <p className="mt-2 font-mono text-xs text-[var(--muted)]">
                    Output · {module.output}
                </p>
            </header>

            {overviewHtml && (
                <div
                    className="prose-doc animate-fade-up course-md mb-10"
                    dangerouslySetInnerHTML={{ __html: overviewHtml }}
                />
            )}
        </>
    );
}

export function LessonBody({
    module,
    lessonId,
    lessonTitle,
    html,
    index,
    total,
}: {
    module: CourseModule;
    lessonId: string;
    lessonTitle: string;
    html: string;
    index: number;
    total: number;
}) {
    return (
        <>
            <header className="mb-8 animate-fade-up">
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={`/course/${module.slug}`}
                        className="text-xs font-medium text-brand hover:underline"
                    >
                        Module {module.number} · {module.title}
                    </Link>
                    <span className="text-[var(--muted)]">/</span>
                    <span className="font-mono text-xs text-[var(--muted)]">
                        {index + 1} / {total}
                    </span>
                </div>
                <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                    Lesson {lessonId}
                </p>
                <h1 className="mt-2 font-display text-[clamp(1.6rem,3.5vw,2.3rem)] font-extrabold tracking-tight text-[var(--fg)]">
                    {lessonTitle}
                </h1>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-aurora-teal" />
                    Học xong → bấm Tiếp để sang lesson / module kế tiếp
                </p>
            </header>

            <div
                className="prose-doc animate-fade-up course-md"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </>
    );
}
