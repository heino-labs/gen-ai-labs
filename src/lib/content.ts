/* =========================================================================
   Content registry — courses + lessons.
   3 khoá chính: Linux (gồm Setup), DevOps, Docker + AI BA/Tester Course.
   ========================================================================= */

export type CategoryStatus = "live" | "soon";
export type CategoryKind = "course";

export interface Category {
    slug: string;
    title: string;
    short: string;
    description: string;
    icon: string;
    accent: [string, string];
    status: CategoryStatus;
    kind: CategoryKind;
    tags: string[];
}

export interface Post {
    /** full route, e.g. "/linux/ssh" */
    slug: string;
    category: string;
    title: string;
    description: string;
    readingTime: string;
    updated: string;
    order: number;
    tags?: string[];
}

/** 3 khoá + AI Course */
export const categories: Category[] = [
    {
        slug: "linux",
        title: "Linux",
        short: "Khoá Linux — Setup Ubuntu → CLI → SSH",
        description:
            "Từ cài Ubuntu lab, lệnh cơ bản, SSH đến users & groups. Setup nằm trong khoá này.",
        icon: "Terminal",
        accent: ["#22d3ee", "#2dd4bf"],
        status: "live",
        kind: "course",
        tags: ["setup", "bash", "ssh", "permissions"],
    },
    {
        slug: "devops",
        title: "DevOps",
        short: "Khoá DevOps — self-host GitLab",
        description:
            "Cài đặt, cấu hình, backup và cron cho GitLab trên Ubuntu Server.",
        icon: "GitBranch",
        accent: ["#f472b6", "#7c5cff"],
        status: "live",
        kind: "course",
        tags: ["gitlab", "server", "backup"],
    },
    {
        slug: "docker",
        title: "Docker",
        short: "Khoá Docker — containers từ gốc",
        description:
            "Images, containers, volumes và networks — containerize với tự tin.",
        icon: "Container",
        accent: ["#38bdf8", "#6366f1"],
        status: "soon",
        kind: "course",
        tags: ["containers", "images"],
    },
    {
        slug: "course",
        title: "AI BA/Tester",
        short: "Khoá AI cho BA/Tester + Playwright",
        description:
            "Problem → Skill → Tool → Practice → Proof. Tám module, case Checkout.",
        icon: "Sparkles",
        accent: ["#22d3ee", "#f472b6"],
        status: "live",
        kind: "course",
        tags: ["ai", "testing", "playwright", "ba"],
    },
];

export const posts: Post[] = [
    /* —— Linux course (Setup = lesson 1) —— */
    {
        slug: "/linux/setup",
        category: "linux",
        title: "Setup · Install Ubuntu",
        description:
            "Tạo Ubuntu VM với Multipass trên Apple Silicon, Intel hoặc Windows.",
        readingTime: "4 min",
        updated: "2024-10-08",
        order: 1,
        tags: ["setup", "multipass", "ubuntu"],
    },
    {
        slug: "/linux/commands",
        category: "linux",
        title: "Linux Commands",
        description:
            "Tham chiếu lệnh hàng ngày mọi engineer nên thuộc.",
        readingTime: "9 min",
        updated: "2024-10-08",
        order: 2,
        tags: ["bash", "cli"],
    },
    {
        slug: "/linux/ssh",
        category: "linux",
        title: "SSH Setup Guide",
        description:
            "Cấu hình OpenSSH, tạo key và xử lý permission-denied.",
        readingTime: "5 min",
        updated: "2024-10-08",
        order: 3,
        tags: ["ssh", "security"],
    },
    {
        slug: "/linux/users-groups",
        category: "linux",
        title: "Users & Groups",
        description:
            "Quản lý quyền, ownership và bài tập thực hành.",
        readingTime: "11 min",
        updated: "2024-10-08",
        order: 4,
        tags: ["permissions", "practice"],
    },

    /* —— DevOps course —— */
    {
        slug: "/devops/gitlab",
        category: "devops",
        title: "Installing GitLab on Ubuntu Server",
        description:
            "Self-host GitLab: install, URL, backup và cron.",
        readingTime: "10 min",
        updated: "2024-10-08",
        order: 1,
        tags: ["gitlab", "backup"],
    },

    /* —— Docker course —— */
    {
        slug: "/docker/overview",
        category: "docker",
        title: "Docker — Overview",
        description: "Nền tảng containerization. Full guide sắp có.",
        readingTime: "1 min",
        updated: "2024-10-08",
        order: 1,
    },

    /* —— AI course (modules listed for search; hub = /course) —— */
    {
        slug: "/course",
        category: "course",
        title: "Lộ trình AI BA/Tester",
        description:
            "AI cho BA/Tester + Automation — 8 module, case Checkout.",
        readingTime: "3 min",
        updated: "2026-09-06",
        order: 1,
        tags: ["curriculum", "path"],
    },
];

/* ----------------------------- helpers ----------------------------------- */

export function getCategory(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug);
}

export function liveCategories(): Category[] {
    return categories.filter((c) => c.status === "live");
}

export function courseCategories(): Category[] {
    return categories.filter((c) => c.kind === "course");
}

export function postsByCategory(slug: string): Post[] {
    return posts
        .filter((p) => p.category === slug)
        .sort((a, b) => a.order - b.order);
}

/** Lessons only (exclude course hub entry for AI) */
export function lessonsByCourse(slug: string): Post[] {
    if (slug === "course") {
        return []; // AI uses curriculum modules, not posts
    }
    return postsByCategory(slug);
}

export function getPost(path: string): Post | undefined {
    const clean = path.replace(/\/$/, "") || "/";
    return posts.find((p) => p.slug === clean);
}

export function getCategoryForPath(path: string): Category | undefined {
    const clean = path.replace(/\/$/, "") || "/";
    // Legacy redirects map
    if (clean === "/setup") return getCategory("linux");
    if (clean === "/linux") return getCategory("linux");
    if (clean === "/devops") return getCategory("devops");
    if (clean === "/docker") return getCategory("docker");

    const post = getPost(clean);
    if (post) return getCategory(post.category);
    const seg = clean.split("/").filter(Boolean)[0];
    return seg ? getCategory(seg) : undefined;
}

export function featuredPosts(limit = 3): Post[] {
    const order = ["/linux/setup", "/linux/commands", "/devops/gitlab"];
    return order
        .map((s) => posts.find((p) => p.slug === s))
        .filter((p): p is Post => Boolean(p))
        .slice(0, limit);
}

export function getAdjacent(path: string): { prev?: Post; next?: Post } {
    const clean = path.replace(/\/$/, "") || "/";
    const post = getPost(clean);
    if (!post) return {};
    const siblings = postsByCategory(post.category).filter(
        (p) => !(p.category === "course" && p.slug === "/course")
    );
    const idx = siblings.findIndex((p) => p.slug === post.slug);
    return {
        prev: idx > 0 ? siblings[idx - 1] : undefined,
        next: idx < siblings.length - 1 ? siblings[idx + 1] : undefined,
    };
}

export const stats = {
    categories: categories.length,
    guides: posts.filter((p) => p.category !== "course").length,
    live: liveCategories().length,
};
