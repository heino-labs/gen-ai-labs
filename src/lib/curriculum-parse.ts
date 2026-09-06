import type { CourseModule } from "@/lib/curriculum";
import { modules } from "@/lib/curriculum";

export interface LessonMeta {
    /** e.g. "2.1" */
    id: string;
    /** URL segment e.g. "2-1" */
    slug: string;
    /** display title without "LESSON 2.1 —" */
    title: string;
    heading: string;
}

export interface ParsedLesson {
    meta: LessonMeta;
    /** markdown body including the ## heading */
    markdown: string;
}

export interface ParsedModule {
    overviewMarkdown: string;
    lessons: ParsedLesson[];
}

const LESSON_RE = /^## LESSON\s+(\d+)\.(\d+)\s*[—–-]\s*(.+)\s*$/gm;

export function parseModuleMarkdown(raw: string): ParsedModule {
    const matches = [...raw.matchAll(LESSON_RE)];
    if (matches.length === 0) {
        return { overviewMarkdown: raw.trim(), lessons: [] };
    }

    const firstIdx = matches[0].index ?? 0;
    const overviewMarkdown = raw.slice(0, firstIdx).trim();

    const lessons: ParsedLesson[] = matches.map((m, i) => {
        const start = m.index ?? 0;
        const end =
            i + 1 < matches.length
                ? (matches[i + 1].index as number)
                : raw.length;
        const major = m[1];
        const minor = m[2];
        const title = m[3].trim();
        const id = `${major}.${minor}`;
        return {
            meta: {
                id,
                slug: `${major}-${minor}`,
                title,
                heading: `LESSON ${id} — ${title}`,
            },
            markdown: raw.slice(start, end).trim(),
        };
    });

    return { overviewMarkdown, lessons };
}

export interface LessonRef {
    module: CourseModule;
    lesson: LessonMeta;
    href: string;
}

/** Flatten all lessons in course order (needs pre-parsed map). */
export function flattenLessons(
    byModule: Record<string, ParsedLesson[]>
): LessonRef[] {
    const out: LessonRef[] = [];
    for (const mod of modules) {
        const list = byModule[mod.slug] ?? [];
        for (const les of list) {
            out.push({
                module: mod,
                lesson: les.meta,
                href: `/course/${mod.slug}/${les.meta.slug}`,
            });
        }
    }
    return out;
}

export function getAdjacentLessons(
    flat: LessonRef[],
    moduleSlug: string,
    lessonSlug: string
): { prev: LessonRef | null; next: LessonRef | null; index: number } {
    const index = flat.findIndex(
        (r) => r.module.slug === moduleSlug && r.lesson.slug === lessonSlug
    );
    if (index < 0) return { prev: null, next: null, index: -1 };
    return {
        prev: index > 0 ? flat[index - 1] : null,
        next: index < flat.length - 1 ? flat[index + 1] : null,
        index,
    };
}
