import { useState, type ReactNode, isValidElement } from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { Check, Copy, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/cn";

/** Aurora-tuned syntax theme. */
const auroraTheme: PrismTheme = {
    plain: { color: "#e6e8f5", backgroundColor: "transparent" },
    styles: [
        { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#6b7194", fontStyle: "italic" } },
        { types: ["punctuation"], style: { color: "#9aa0c4" } },
        { types: ["property", "tag", "constant", "symbol", "deleted"], style: { color: "#f472b6" } },
        { types: ["boolean", "number"], style: { color: "#fbbf24" } },
        { types: ["selector", "attr-name", "string", "char", "builtin", "inserted"], style: { color: "#2dd4bf" } },
        { types: ["operator", "entity", "url", "variable"], style: { color: "#22d3ee" } },
        { types: ["atrule", "attr-value", "keyword"], style: { color: "#a78bfa" } },
        { types: ["function", "class-name"], style: { color: "#7cc4ff" } },
        { types: ["regex", "important"], style: { color: "#fbbf24" } },
    ],
};

const LANG_ALIASES: Record<string, string> = {
    copy: "bash",
    cmd: "bash",
    sh: "bash",
    shell: "bash",
    "": "bash",
    text: "bash",
};

function nodeToString(node: ReactNode): string {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(nodeToString).join("");
    if (isValidElement(node)) return nodeToString((node.props as { children?: ReactNode }).children);
    return "";
}

const LANG_LABEL: Record<string, string> = {
    bash: "shell",
    js: "javascript",
    ts: "typescript",
};

export function CodeBlock({ children }: { children?: ReactNode }) {
    const [copied, setCopied] = useState(false);

    // children is the <code> element produced by MDX
    let rawLang = "bash";
    let code = "";

    if (isValidElement(children)) {
        const props = children.props as { className?: string; children?: ReactNode };
        rawLang = (props.className || "").replace(/language-/, "").trim();
        code = nodeToString(props.children).replace(/\n$/, "");
    } else {
        code = nodeToString(children).replace(/\n$/, "");
    }

    const language = LANG_ALIASES[rawLang] ?? rawLang ?? "bash";
    const label = LANG_LABEL[language] ?? language ?? "code";

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            /* clipboard blocked — no-op */
        }
    };

    return (
        <div className="group relative my-6 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[#0b0b16] shadow-glass">
            {/* title bar */}
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.03] px-4 py-2">
                <div className="flex items-center gap-2 text-[11px] font-medium text-[#8186a6]">
                    <span className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    </span>
                    <span className="ml-1 flex items-center gap-1.5 uppercase tracking-widest">
                        <TerminalSquare className="h-3.5 w-3.5" /> {label}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={copy}
                    aria-label="Copy code"
                    className={cn(
                        "ring-focus flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                        copied
                            ? "text-aurora-teal"
                            : "text-[#8186a6] hover:bg-white/5 hover:text-white"
                    )}
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5" /> Copied
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" /> Copy
                        </>
                    )}
                </button>
            </div>

            {/* code */}
            <Highlight code={code} language={language} theme={auroraTheme}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className={cn(
                            className,
                            "overflow-x-auto px-4 py-4 text-[13.5px] leading-relaxed"
                        )}
                        style={{ ...style, fontFamily: "var(--font-mono), monospace" }}
                    >
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })} className="table-row">
                                <span className="table-cell select-none pr-4 text-right text-[#3f4467]">
                                    {i + 1}
                                </span>
                                <span className="table-cell">
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </span>
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}
