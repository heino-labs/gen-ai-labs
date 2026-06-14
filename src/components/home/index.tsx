import Head from "next/head";
import Link from "next/link";
import { useMemo } from "react";
import { site } from "@/lib/site";
import { categories, postsByCategory } from "@/lib/content";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Surface } from "@/components/home/strata/surface";
import { Stratum } from "@/components/home/strata/stratum";
import { Core } from "@/components/home/strata/core";
import { DepthRail } from "@/components/home/strata/depth-rail";
import { useDepth } from "@/components/home/strata/use-depth";

/* =========================================================================
   STRATA — the homepage is not a webpage, it is a bore hole.
   One axis (depth), deterministic asymmetry (hash-driven), one focal
   instrument (the depth gauge). No navbar, no hero-grid, no footer —
   surface, strata, core.
   ========================================================================= */

const SURFACE_DEPTH = 60; // m before the first stratum
const SPACING = 280; // m of earth per stratum

export default function Home() {
    const strata = useMemo(
        () =>
            categories.map((c, i) => ({
                category: c,
                posts: postsByCategory(c.slug),
                depthStart: SURFACE_DEPTH + i * SPACING,
            })),
        []
    );
    const totalDepth = SURFACE_DEPTH + strata.length * SPACING;
    const sectionIds = useMemo(
        () => strata.map((s) => `stratum-${s.category.slug}`),
        [strata]
    );
    const { depth, progress, active } = useDepth(totalDepth, sectionIds);

    return (
        <>
            <Head>
                <title>{`${site.name} — ${site.tagline}`}</title>
                <meta name="description" content={site.description} />
                <meta property="og:title" content={`${site.name} — ${site.tagline}`} />
                <meta property="og:description" content={site.description} />
            </Head>

            <header className="fixed right-4 top-4 z-30 flex items-center gap-2">
                <span className="glass">
                    <ThemeToggle />
                </span>
            </header>

            <DepthRail
                stops={strata.map(({ category, depthStart }) => ({
                    category,
                    depthStart,
                }))}
                totalDepth={totalDepth}
                depth={depth}
                progress={progress}
                active={active}
            />

            <main className="relative md:pl-16">
                <Surface totalDepth={totalDepth} />
                {strata.map(({ category, posts, depthStart }, i) => (
                    <Stratum
                        key={category.slug}
                        category={category}
                        posts={posts}
                        index={i}
                        depthStart={depthStart}
                        spacing={SPACING}
                    />
                ))}
                <Core totalDepth={totalDepth} />
            </main>
        </>
    );
}
