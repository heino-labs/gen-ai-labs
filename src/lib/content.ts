/* =========================================================================
   Content registry — single source of truth for categories & posts.
   Add a new category or post here and the home page, sidebar, navigation
   and breadcrumbs all update automatically.
   ========================================================================= */

export type CategoryStatus = "live" | "soon";

export interface Category {
    slug: string;
    title: string;
    /** one-line tagline shown on cards */
    short: string;
    description: string;
    /** lucide-react icon key, resolved in <Icon/> */
    icon: string;
    /** two-stop accent gradient [from, to] */
    accent: [string, string];
    status: CategoryStatus;
    tags: string[];
}

export interface Post {
    /** full route, e.g. "/linux/ssh" or "/setup" */
    slug: string;
    category: string;
    title: string;
    description: string;
    readingTime: string;
    updated: string;
    order: number;
    tags?: string[];
}

export const categories: Category[] = [
    {
        slug: "setup",
        title: "Setup",
        short: "Spin up a clean Ubuntu lab in minutes",
        description:
            "Provision development environments with Multipass & Ubuntu — from zero to a working VM.",
        icon: "Rocket",
        accent: ["#7c5cff", "#22d3ee"],
        status: "live",
        tags: ["multipass", "ubuntu", "vm"],
    },
    {
        slug: "linux",
        title: "Linux",
        short: "Command-line fluency, the practical way",
        description:
            "Essential commands, SSH, users & groups and hands-on exercises to make the shell second nature.",
        icon: "Terminal",
        accent: ["#22d3ee", "#2dd4bf"],
        status: "live",
        tags: ["bash", "ssh", "permissions"],
    },
    {
        slug: "devops",
        title: "DevOps",
        short: "Self-host GitLab like a pro",
        description:
            "Install, configure, back up and restore GitLab on Ubuntu Server with automated cron backups.",
        icon: "GitBranch",
        accent: ["#f472b6", "#7c5cff"],
        status: "live",
        tags: ["gitlab", "server", "backup"],
    },
    {
        slug: "docker",
        title: "Docker",
        short: "Containers from first principles",
        description:
            "Images, containers, volumes and networks — containerize anything with confidence.",
        icon: "Container",
        accent: ["#38bdf8", "#6366f1"],
        status: "soon",
        tags: ["containers", "images"],
    },
    {
        slug: "cicd",
        title: "CI/CD",
        short: "Ship continuously, sleep peacefully",
        description:
            "Design pipelines that build, test and deploy automatically across environments.",
        icon: "Workflow",
        accent: ["#fbbf24", "#f472b6"],
        status: "soon",
        tags: ["pipelines", "automation"],
    },
    {
        slug: "ut",
        title: "Unit Testing",
        short: "Tests that actually catch bugs",
        description:
            "Testing philosophy, patterns and frameworks — write suites you can trust and refactor against.",
        icon: "FlaskConical",
        accent: ["#34d399", "#22d3ee"],
        status: "soon",
        tags: ["testing", "coverage", "tdd"],
    },
    {
        slug: "llm",
        title: "LLM",
        short: "Build with large language models",
        description:
            "Prompting, RAG, agents and evaluation — practical engineering for modern AI systems.",
        icon: "Sparkles",
        accent: ["#a78bfa", "#f472b6"],
        status: "soon",
        tags: ["ai", "rag", "agents"],
    },
];

export const posts: Post[] = [
    {
        slug: "/setup",
        category: "setup",
        title: "Install Ubuntu",
        description:
            "Create and launch an Ubuntu VM with Multipass on Apple Silicon, Intel or Windows.",
        readingTime: "4 min",
        updated: "2024-10-08",
        order: 1,
        tags: ["multipass", "ubuntu"],
    },
    {
        slug: "/linux",
        category: "linux",
        title: "Linux Commands",
        description:
            "A practical reference of the everyday commands every engineer should know by heart.",
        readingTime: "9 min",
        updated: "2024-10-08",
        order: 1,
        tags: ["bash", "cli"],
    },
    {
        slug: "/linux/ssh",
        category: "linux",
        title: "SSH Setup Guide",
        description:
            "Configure OpenSSH on Ubuntu, generate keys and fix the classic permission-denied errors.",
        readingTime: "5 min",
        updated: "2024-10-08",
        order: 2,
        tags: ["ssh", "security"],
    },
    {
        slug: "/linux/users-groups",
        category: "linux",
        title: "Users & Groups",
        description:
            "Manage permissions, ownership and run through a full set of hands-on practice exercises.",
        readingTime: "11 min",
        updated: "2024-10-08",
        order: 3,
        tags: ["permissions", "practice"],
    },
    {
        slug: "/devops",
        category: "devops",
        title: "Installing GitLab on Ubuntu Server",
        description:
            "End-to-end GitLab self-hosting: install, configure external URL, back up and schedule cron jobs.",
        readingTime: "10 min",
        updated: "2024-10-08",
        order: 1,
        tags: ["gitlab", "backup"],
    },
    {
        slug: "/docker",
        category: "docker",
        title: "Docker — Overview",
        description: "Containerization fundamentals. Full guide coming soon.",
        readingTime: "1 min",
        updated: "2024-10-08",
        order: 1,
    },
    {
        slug: "/cicd",
        category: "cicd",
        title: "CI/CD — Overview",
        description: "Continuous delivery pipelines. Full guide coming soon.",
        readingTime: "1 min",
        updated: "2024-10-08",
        order: 1,
    },
];

/* ----------------------------- helpers ----------------------------------- */

export function getCategory(slug: string): Category | undefined {
    return categories.find((c) => c.slug === slug);
}

export function liveCategories(): Category[] {
    return categories.filter((c) => c.status === "live");
}

export function postsByCategory(slug: string): Post[] {
    return posts
        .filter((p) => p.category === slug)
        .sort((a, b) => a.order - b.order);
}

export function getPost(path: string): Post | undefined {
    const clean = path.replace(/\/$/, "") || "/";
    return posts.find((p) => p.slug === clean);
}

export function getCategoryForPath(path: string): Category | undefined {
    const post = getPost(path);
    if (post) return getCategory(post.category);
    // fall back to first path segment
    const seg = path.split("/").filter(Boolean)[0];
    return seg ? getCategory(seg) : undefined;
}

export function featuredPosts(limit = 3): Post[] {
    const order = ["/devops", "/linux", "/setup", "/linux/ssh"];
    return order
        .map((s) => posts.find((p) => p.slug === s))
        .filter((p): p is Post => Boolean(p))
        .slice(0, limit);
}

/** previous / next post within the same category, by order */
export function getAdjacent(path: string): { prev?: Post; next?: Post } {
    const post = getPost(path);
    if (!post) return {};
    const siblings = postsByCategory(post.category);
    const idx = siblings.findIndex((p) => p.slug === post.slug);
    return {
        prev: idx > 0 ? siblings[idx - 1] : undefined,
        next: idx < siblings.length - 1 ? siblings[idx + 1] : undefined,
    };
}

export const stats = {
    categories: categories.length,
    guides: posts.length,
    live: liveCategories().length,
};
