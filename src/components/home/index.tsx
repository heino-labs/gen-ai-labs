import Head from "next/head";
import { site } from "@/lib/site";
import { UniverseHome } from "@/components/home/universe";

export default function Home() {
    return (
        <>
            <Head>
                <title>{`${site.name || site.tagline} — ${site.tagline}`}</title>
                <meta name="description" content={site.description} />
                <meta
                    property="og:title"
                    content={`${site.name || site.tagline} — ${site.tagline}`}
                />
                <meta property="og:description" content={site.description} />
            </Head>
            <UniverseHome />
        </>
    );
}
