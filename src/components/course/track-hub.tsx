import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
    getCategory,
    lessonsByCourse,
    type Category,
    type Post,
} from "@/lib/content";
import { Icon } from "@/components/ui/icon";

/** Course hub body — danh sách lesson (dùng trong DocLayout). */
export function TrackHub({ slug }: { slug: string }) {
    const course = getCategory(slug) as Category;
    const lessons = lessonsByCourse(slug);
    const first = lessons[0];

    return (
        <div className="animate-fade-up">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
                Khoá học · {course.status === "soon" ? "soon" : "live"}
            </p>
            <h1 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold tracking-tight text-[var(--fg)]">
                {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--fg-soft)]">
                {course.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {course.tags.map((t) => (
                    <span
                        key={t}
                        className="rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                        style={{
                            borderColor: `${course.accent[0]}55`,
                            color: course.accent[0],
                        }}
                    >
                        {t}
                    </span>
                ))}
            </div>

            {first && course.status === "live" && (
                <Link
                    href={first.slug}
                    className="ring-focus group mt-8 inline-flex items-center gap-2 rounded-xl bg-aurora-grad px-5 py-3 text-sm font-semibold text-white shadow-glow"
                >
                    Bắt đầu · Lesson 1
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            )}

            <h2 className="mt-12 font-display text-xl font-bold text-[var(--fg)]">
                Lessons trong khoá
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
                Học tuần tự — xong lesson bấm Tiếp để sang bài kế.
            </p>

            <ol className="mt-5 space-y-2">
                {lessons.map((les, i) => (
                    <LessonRow
                        key={les.slug}
                        lesson={les}
                        index={i}
                        total={lessons.length}
                        course={course}
                        locked={course.status !== "live"}
                    />
                ))}
                {!lessons.length && (
                    <li className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">
                        Chưa có lesson — sắp cập nhật.
                    </li>
                )}
            </ol>
        </div>
    );
}

function LessonRow({
    lesson,
    index,
    total,
    course,
    locked,
}: {
    lesson: Post;
    index: number;
    total: number;
    course: Category;
    locked: boolean;
}) {
    const inner = (
        <>
            <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl font-mono text-xs font-bold text-white"
                style={{
                    background: `linear-gradient(135deg, ${course.accent[0]}, ${course.accent[1]})`,
                }}
            >
                {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block font-display font-semibold text-[var(--fg)] group-hover:text-brand">
                    {lesson.title}
                </span>
                <span className="mt-0.5 block text-sm text-[var(--muted)]">
                    {lesson.description}
                </span>
                <span className="mt-1 block font-mono text-[10px] text-[var(--muted)]">
                    Lesson {index + 1}/{total}
                    {lesson.readingTime ? ` · ${lesson.readingTime}` : ""}
                </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-0.5" />
        </>
    );

    if (locked) {
        return (
            <li className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 px-4 py-4 opacity-60">
                {inner}
            </li>
        );
    }

    return (
        <li>
            <Link
                href={lesson.slug}
                className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 px-4 py-4 transition-colors hover:border-[rgba(124,92,255,0.35)]"
            >
                {inner}
            </Link>
        </li>
    );
}

export function TrackHubIcon({ slug }: { slug: string }) {
    const course = getCategory(slug);
    if (!course) return null;
    return (
        <span
            className="mb-4 grid h-12 w-12 place-items-center rounded-2xl text-white shadow-glow"
            style={{
                background: `linear-gradient(135deg, ${course.accent[0]}, ${course.accent[1]})`,
            }}
        >
            <Icon name={course.icon} className="h-6 w-6" />
        </span>
    );
}
