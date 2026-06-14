import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ListTree, ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

interface Heading {
    id: string;
    text: string;
    level: number;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\wÀ-ɏḀ-ỿ\s-]/g, "")
        .replace(/\s+/g, "-");
}

/** Auto-generated table of contents from the rendered article. */
export function Toc() {
    const router = useRouter();
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [active, setActive] = useState<string>("");

    useEffect(() => {
        const article = document.querySelector(".prose-doc");
        if (!article) return;
        const nodes = Array.from(
            article.querySelectorAll("h2, h3")
        ) as HTMLElement[];

        const used = new Set<string>();
        const list: Heading[] = nodes.map((node) => {
            let id = node.id || slugify(node.textContent || "section");
            while (used.has(id)) id = `${id}-1`;
            used.add(id);
            node.id = id;
            node.style.scrollMarginTop = "6rem";
            return {
                id,
                text: node.textContent || "",
                level: node.tagName === "H3" ? 3 : 2,
            };
        });
        setHeadings(list);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] }
        );
        nodes.forEach((n) => observer.observe(n));
        return () => observer.disconnect();
    }, [router.asPath]);

    if (headings.length === 0) return null;

    return (
        <div className="text-sm">
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                <ListTree className="h-3.5 w-3.5" /> On this page
            </p>
            <ul className="space-y-1 border-l border-[var(--border)]">
                {headings.map((h) => (
                    <li key={h.id}>
                        <a
                            href={`#${h.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document
                                    .getElementById(h.id)
                                    ?.scrollIntoView({ behavior: "smooth" });
                                history.replaceState(null, "", `#${h.id}`);
                            }}
                            className={cn(
                                "-ml-px block border-l-2 py-1 transition-colors",
                                h.level === 3 ? "pl-6" : "pl-3",
                                active === h.id
                                    ? "border-brand font-medium text-brand"
                                    : "border-transparent text-[var(--muted)] hover:text-[var(--fg)]"
                            )}
                        >
                            {h.text}
                        </a>
                    </li>
                ))}
            </ul>
            <button
                onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="mt-5 flex items-center gap-1.5 text-xs text-[var(--muted)] transition-colors hover:text-brand"
            >
                <ArrowUp className="h-3.5 w-3.5" /> Back to top
            </button>
        </div>
    );
}
