import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";
import { Callout } from "@/components/ui/callout";
import { asset } from "@/lib/cn";

function MdxLink({
    href = "",
    children,
    ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
    const isInternal = href.startsWith("/") && !href.startsWith("//");
    if (isInternal) {
        return (
            <Link href={href} {...rest}>
                {children}
            </Link>
        );
    }
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
            {children}
        </a>
    );
}

function MdxImg({ src = "", alt = "", ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(src)} alt={alt} loading="lazy" {...rest} />;
}

export const mdxComponents = {
    pre: (props: { children?: ReactNode }) => <CodeBlock {...props} />,
    a: MdxLink,
    img: MdxImg,
    Callout,
};
