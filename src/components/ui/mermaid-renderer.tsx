import { useEffect } from "react";

let renderBatch = 0;

export function MermaidRenderer() {
    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            const nodes = Array.from(
                document.querySelectorAll<HTMLElement>("pre.mermaid")
            );
            if (nodes.length === 0) return;

            const dark =
                document.documentElement.classList.contains("dark") ||
                (document.documentElement.dataset.theme ?? "") === "dark";

            const mermaid = (await import("mermaid")).default;
            mermaid.initialize({
                startOnLoad: false,
                securityLevel: "loose",
                theme: dark ? "dark" : "base",
                themeVariables: dark
                    ? {
                          background: "transparent",
                          primaryColor: "rgba(124, 92, 255, 0.22)",
                          primaryTextColor: "#e2e8f0",
                          primaryBorderColor: "#7c5cff",
                          lineColor: "#94a3b8",
                          secondaryColor: "rgba(34, 211, 238, 0.18)",
                          tertiaryColor: "rgba(34, 211, 238, 0.1)",
                          fontFamily: "inherit",
                      }
                    : {
                          background: "transparent",
                          primaryColor: "rgba(124, 92, 255, 0.12)",
                          primaryTextColor: "#1a1a2e",
                          primaryBorderColor: "#7c5cff",
                          lineColor: "#64748b",
                          secondaryColor: "rgba(34, 211, 238, 0.12)",
                          tertiaryColor: "rgba(34, 211, 238, 0.06)",
                          fontFamily: "inherit",
                      },
            });

            for (const node of nodes) {
                if (cancelled) return;
                const source = node.textContent ?? "";
                try {
                    const batch = `${(renderBatch += 1)}`;
                    const { svg } = await mermaid.render(
                        `mmd-${batch}`,
                        source
                    );
                    node.classList.remove("mermaid");
                    node.classList.add("mermaid-rendered");
                    node.innerHTML = svg;
                } catch {
                    node.classList.add("mermaid-error");
                    node.setAttribute(
                        "data-error",
                        "Mermaid render failed"
                    );
                }
            }
        };

        void run();
        return () => {
            cancelled = true;
        };
    }, []);

    return null;
}