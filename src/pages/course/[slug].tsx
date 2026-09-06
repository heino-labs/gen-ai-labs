import type { GetStaticPaths, GetStaticProps } from "next";
import {
    modules,
    getModule,
    getAdjacentModules,
    type CourseModule,
} from "@/lib/curriculum";
import { markdownToHtml } from "@/lib/markdown";
import {
    loadParsedModule,
    loadSidebarTree,
    type SidebarModule,
} from "@/lib/curriculum-load";
import {
    CourseShell,
    ModuleOverviewBody,
} from "@/components/course/course-shell";

type LessonCard = {
    id: string;
    slug: string;
    title: string;
    href: string;
};

type Props = {
    module: CourseModule;
    overviewHtml: string;
    lessons: LessonCard[];
    sidebar: SidebarModule[];
    prevHref: string | null;
    prevLabel: string | null;
    nextHref: string | null;
    nextLabel: string | null;
    nextSub: string | null;
};

export default function CourseModulePage({
    module,
    overviewHtml,
    lessons,
    sidebar,
    prevHref,
    prevLabel,
    nextHref,
    nextLabel,
    nextSub,
}: Props) {
    const first = lessons[0];
    return (
        <CourseShell
            module={module}
            sidebar={sidebar}
            title={`M${module.number} · ${module.title}`}
            description={module.goal}
            prev={
                prevHref && prevLabel
                    ? { href: prevHref, label: prevLabel }
                    : { href: "/course", label: "Về lộ trình khoá học" }
            }
            next={
                first
                    ? {
                          href: first.href,
                          label: `Bắt đầu · Lesson ${first.id}`,
                          sub: first.title,
                      }
                    : nextHref && nextLabel
                      ? {
                            href: nextHref,
                            label: nextLabel,
                            sub: nextSub ?? undefined,
                        }
                      : null
            }
        >
            <ModuleOverviewBody
                module={module}
                overviewHtml={overviewHtml}
                lessons={lessons}
            />
        </CourseShell>
    );
}

export const getStaticPaths: GetStaticPaths = async () => ({
    paths: modules.map((m) => ({ params: { slug: m.slug } })),
    fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
    const slug = String(ctx.params?.slug ?? "");
    const module = getModule(slug);
    if (!module) return { notFound: true };

    const parsed = loadParsedModule(module);
    const overviewHtml = markdownToHtml(parsed.overviewMarkdown);
    const lessons: LessonCard[] = parsed.lessons.map((l) => ({
        id: l.meta.id,
        slug: l.meta.slug,
        title: l.meta.title,
        href: `/course/${module.slug}/${l.meta.slug}`,
    }));
    const sidebar = loadSidebarTree();
    const { prev, next } = getAdjacentModules(slug);

    return {
        props: {
            module,
            overviewHtml,
            lessons,
            sidebar,
            prevHref: prev ? `/course/${prev.slug}` : null,
            prevLabel: prev ? `M${prev.number} · ${prev.title}` : null,
            nextHref: next ? `/course/${next.slug}` : null,
            nextLabel: next ? `M${next.number} · ${next.title}` : null,
            nextSub: next ? next.short : null,
        },
    };
};
