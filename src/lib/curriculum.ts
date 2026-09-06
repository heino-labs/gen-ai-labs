/* =========================================================================
   Curriculum registry — AI cho BA/Tester + Automation
   Source of truth for /course path UI. Lesson bodies live in docs/curriculum/.
   ========================================================================= */

export type TierId = "understand" | "apply" | "automate";

export interface Tier {
    id: TierId;
    number: number;
    title: string;
    subtitle: string;
}

export interface CourseModule {
    slug: string;
    number: string;
    title: string;
    short: string;
    goal: string;
    output: string;
    tier: TierId;
    lessons: number;
    /** filename under docs/curriculum/ */
    file: string;
    accent: [string, string];
    icon: string;
}

export const courseMeta = {
    title: "AI cho BA/Tester + Automation",
    tagline: "Problem → Skill → Tool → Practice → Proof",
    description:
        "Học cách lấy việc BA/Tester thủ công, dùng AI đúng chỗ, kiểm soát bằng context/rule, tự động hoá bằng Playwright, rồi chứng minh bằng số liệu.",
    caseStudy: "E-commerce Checkout",
    tool: "Claude",
    audience: "BA + Tester",
    formula: "Problem → Why → Skill → Tool → Practice → Proof",
};

export const tiers: Tier[] = [
    {
        id: "understand",
        number: 1,
        title: "UNDERSTAND",
        subtitle: "Hiểu nền tảng AI & giới hạn",
    },
    {
        id: "apply",
        number: 2,
        title: "APPLY",
        subtitle: "Dùng AI vào công việc BA/Tester",
    },
    {
        id: "automate",
        number: 3,
        title: "AUTOMATE",
        subtitle: "Workflow tự động + chứng minh giá trị",
    },
];

export const modules: CourseModule[] = [
    {
        slug: "02-ai-foundation",
        number: "02",
        title: "AI / GenAI Foundation",
        short: "AI làm được gì, giới hạn ở đâu",
        goal: "Dùng AI có kiểm soát — không phó thác.",
        output: "AI Limitation Report",
        tier: "understand",
        lessons: 3,
        file: "MODULE-02-ai-foundation.md",
        accent: ["#22d3ee", "#2dd4bf"],
        icon: "Sparkles",
    },
    {
        slug: "03-prompt-context-rule",
        number: "03",
        title: "Prompt + Context + Rule",
        short: "Bộ AI working assets",
        goal: "Siết chuỗi Prompt → Context → Rule → Structured output.",
        output: "/prompt · /context · /rules",
        tier: "understand",
        lessons: 4,
        file: "MODULE-03-prompt-context-rule.md",
        accent: ["#38bdf8", "#6366f1"],
        icon: "MessageSquare",
    },
    {
        slug: "04-ai-for-ba-tester",
        number: "04",
        title: "AI for BA / Tester",
        short: "Theo công việc thật, không theo feature",
        goal: "Gắn AI vào Analyze → Design → Review.",
        output: "BA/Tester AI Playbook",
        tier: "apply",
        lessons: 5,
        file: "MODULE-04-ai-for-ba-tester.md",
        accent: ["#f472b6", "#7c5cff"],
        icon: "Briefcase",
    },
    {
        slug: "05-ai-validation",
        number: "05",
        title: "AI Quality / Validation",
        short: "Làm sao biết AI làm đúng?",
        goal: "Rule → Ground truth → Human → Measure.",
        output: "AI-VALIDATION-PROTOCOL",
        tier: "apply",
        lessons: 4,
        file: "MODULE-05-ai-validation.md",
        accent: ["#34d399", "#22d3ee"],
        icon: "ShieldCheck",
    },
    {
        slug: "06-playwright",
        number: "06",
        title: "Playwright Automation",
        short: "Automation duy nhất học sâu",
        goal: "Manual TC → suite Playwright + evidence.",
        output: "Playwright test suite",
        tier: "automate",
        lessons: 3,
        file: "MODULE-06-playwright.md",
        accent: ["#fbbf24", "#f472b6"],
        icon: "Bot",
    },
    {
        slug: "07-ai-playwright",
        number: "07",
        title: "AI + Playwright",
        short: "Generate · Debug · Maintain",
        goal: "Workflow AI-assisted vẫn human verify.",
        output: "AI-assisted Playwright workflow",
        tier: "automate",
        lessons: 3,
        file: "MODULE-07-ai-playwright.md",
        accent: ["#a78bfa", "#22d3ee"],
        icon: "Workflow",
    },
    {
        slug: "08-ecosystem-lab",
        number: "08",
        title: "AI Testing Ecosystem",
        short: "Lab theo problem, không theo tool-course",
        goal: "Applitools → agent: khi nào dùng / không dùng.",
        output: "Ecosystem map + labs",
        tier: "automate",
        lessons: 6,
        file: "MODULE-08-ecosystem-lab.md",
        accent: ["#fb7185", "#a78bfa"],
        icon: "FlaskConical",
    },
    {
        slug: "09-capstone",
        number: "09",
        title: "End-to-End Project",
        short: "Ghép evidence — không nội dung mới",
        goal: "Story + metrics + capstone pack.",
        output: "Capstone evidence pack",
        tier: "automate",
        lessons: 4,
        file: "MODULE-09-capstone.md",
        accent: ["#2dd4bf", "#fbbf24"],
        icon: "Flag",
    },
];

export const lessonEngine = [
    "PROBLEM",
    "WHY IT MATTERS",
    "MINIMUM THEORY",
    "DIAGRAM",
    "LIVE DEMO",
    "GUIDED PRACTICE",
    "REAL TASK",
    "VALIDATE",
    "MEASURE",
    "DOCUMENT & REUSE",
] as const;

export function getModule(slug: string): CourseModule | undefined {
    return modules.find((m) => m.slug === slug);
}

export function getAdjacentModules(slug: string): {
    prev?: CourseModule;
    next?: CourseModule;
} {
    const idx = modules.findIndex((m) => m.slug === slug);
    if (idx < 0) return {};
    return {
        prev: idx > 0 ? modules[idx - 1] : undefined,
        next: idx < modules.length - 1 ? modules[idx + 1] : undefined,
    };
}

export function modulesByTier(tier: TierId): CourseModule[] {
    return modules.filter((m) => m.tier === tier);
}
