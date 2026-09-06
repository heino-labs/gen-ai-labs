import path from "path";
import fs from "fs";
import { modules, type CourseModule } from "@/lib/curriculum";
import {
    parseModuleMarkdown,
    flattenLessons,
    type LessonRef,
    type ParsedLesson,
    type ParsedModule,
} from "@/lib/curriculum-parse";

function readModuleFile(mod: CourseModule): string {
    return fs.readFileSync(
        path.join(process.cwd(), "docs", "curriculum", mod.file),
        "utf8"
    );
}

export function loadParsedModule(mod: CourseModule): ParsedModule {
    return parseModuleMarkdown(readModuleFile(mod));
}

export function loadAllLessonsByModule(): Record<string, ParsedLesson[]> {
    const map: Record<string, ParsedLesson[]> = {};
    for (const mod of modules) {
        map[mod.slug] = loadParsedModule(mod).lessons;
    }
    return map;
}

export function loadFlatLessonRefs(): LessonRef[] {
    return flattenLessons(loadAllLessonsByModule());
}

export type SidebarLesson = {
    slug: string;
    id: string;
    title: string;
    href: string;
};

export type SidebarModule = {
    slug: string;
    number: string;
    title: string;
    accent: [string, string];
    lessons: SidebarLesson[];
};

export function loadSidebarTree(): SidebarModule[] {
    return modules.map((mod) => {
        const parsed = loadParsedModule(mod);
        return {
            slug: mod.slug,
            number: mod.number,
            title: mod.title,
            accent: mod.accent,
            lessons: parsed.lessons.map((l) => ({
                slug: l.meta.slug,
                id: l.meta.id,
                title: l.meta.title,
                href: `/course/${mod.slug}/${l.meta.slug}`,
            })),
        };
    });
}
