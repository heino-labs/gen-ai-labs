import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { Category, Post } from "@/lib/content";

export function Breadcrumbs({
    category,
    post,
}: {
    category?: Category;
    post?: Post;
}) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted)]"
        >
            <Link href="/" className="flex items-center gap-1 hover:text-brand">
                <Home className="h-3.5 w-3.5" />
            </Link>
            {category && (
                <>
                    <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                    <Link
                        href={`/${category.slug}`}
                        className="hover:text-brand"
                    >
                        {category.title}
                    </Link>
                </>
            )}
            {post && post.slug !== `/${category?.slug}` && (
                <>
                    <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                    <span className="text-[var(--fg-soft)]">{post.title}</span>
                </>
            )}
        </nav>
    );
}
