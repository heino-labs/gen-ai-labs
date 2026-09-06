import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { MDXProvider } from "@mdx-js/react";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { DocLayout } from "@/components/layout/doc-layout";
import { mdxComponents } from "@/components/mdx/mdx-components";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const bare =
        router.pathname === "/" ||
        router.pathname === "/course" ||
        router.pathname.startsWith("/course/");

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <MDXProvider components={mdxComponents}>
                <div className="font-sans">
                    <AuroraBackground />
                    {bare ? (
                        <Component {...pageProps} />
                    ) : (
                        <DocLayout>
                            <Component {...pageProps} />
                        </DocLayout>
                    )}
                </div>
            </MDXProvider>
        </ThemeProvider>
    );
}
