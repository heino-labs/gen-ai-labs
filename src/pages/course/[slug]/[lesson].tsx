import type { GetStaticPaths, GetStaticProps } from "next";
import { modules, getModule, type CourseModule } from "@/lib/curriculum";
import { markdownToHtml } from "@/lib/markdown";
import {
    loadParsedModule,
    loadFlatLessonRefs,
    loadSidebarTree,
    type SidebarModule,
} from "@/lib/curriculum-load";
import { getAdjacentLessons } from "@/lib/curriculum-parse";
import { CourseShell, LessonBody } from "@/components/course/course-shell";

type Props = {
    module: CourseModule;
    lessonId: string;
    lessonSlug: string;
    lessonTitle: string;
    html: string;
    index: number;
    totalInModule: number;
    sidebar: SidebarModule[];
    prevHref: string | null;
    prevLabel: string | null;
    prevSub: string | null;
    nextHref: string | null;
    nextLabel: string | null;
    nextSub: string | null;
};

export default function CourseLessonPage({
    module,
    lessonId,
    lessonSlug,
    lessonTitle,
    html,
    index,
    totalInModule,
    sidebar,
    prevHref,
    prevLabel,
    prevSub,
    nextHref,
    nextLabel,
    nextSub,
}: Props) {
    return (
        <CourseShell
            module={module}
            sidebar={sidebar}
            activeLessonSlug={lessonSlug}
            title={`Lesson ${lessonId} · ${lessonTitle}`}
            description={lessonTitle}
            prev={
                prevHref && prevLabel
                    ? {
                          href: prevHref,
                          label: prevLabel,
                          sub: prevSub ?? undefined,
                      }
                    : {
                          href: `/course/${module.slug}`,
                          label: `Tổng quan Module ${module.number}`,
                      }
            }
            next={
                nextHref && nextLabel
                    ? {
                          href: nextHref,
                          label: nextLabel,
                          sub: nextSub ?? undefined,
                      }
                    : {
                          href: "/course",
                          label: "Hoàn thành lộ trình",
                          sub: "Về trang khoá học",
                      }
            }
        >
            <LessonBody
                module={module}
                lessonId={lessonId}
                lessonTitle={lessonTitle}
                html={html}
                index={index}
                total={totalInModule}
            />
        </CourseShell>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths: { params: { slug: string; lesson: string } }[] = [];
    for (const mod of modules) {
        const parsed = loadParsedModule(mod);
        for (const les of parsed.lessons) {
            paths.push({
                params: { slug: mod.slug, lesson: les.meta.slug },
            });
        }
    }
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
    const slug = String(ctx.params?.slug ?? "");
    const lessonSlug = String(ctx.params?.lesson ?? "");
    const module = getModule(slug);
    if (!module) return { notFound: true };

    const parsed = loadParsedModule(module);
    const lesson = parsed.lessons.find((l) => l.meta.slug === lessonSlug);
    if (!lesson) return { notFound: true };

    const flat = loadFlatLessonRefs();
    const { prev, next } = getAdjacentLessons(flat, slug, lessonSlug);
    const indexInModule = parsed.lessons.findIndex(
        (l) => l.meta.slug === lessonSlug
    );

    const sidebar = loadSidebarTree();

    const bodyMd = lesson.markdown.replace(/^##\s+LESSON[^\n]+\n+/, "");

    return {
        props: {
            module,
            lessonId: lesson.meta.id,
            lessonSlug: lesson.meta.slug,
            lessonTitle: lesson.meta.title,
            html: markdownToHtml(bodyMd),
            index: indexInModule,
            totalInModule: parsed.lessons.length,
            sidebar,
            prevHref: prev?.href ?? null,
            prevLabel: prev
                ? `Lesson ${prev.lesson.id}`
                : null,
            prevSub: prev?.lesson.title ?? null,
            nextHref: next?.href ?? null,
            nextLabel: next
                ? next.module.slug === slug
                    ? `Lesson ${next.lesson.id}`
                    : `Module ${next.module.number} · Lesson ${next.lesson.id}`
                : null,
            nextSub: next
                ? next.module.slug === slug
                    ? next.lesson.title
                    : `${next.module.title} — ${next.lesson.title}`
                : null,
        },
    };
};
