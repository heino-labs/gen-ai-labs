/**
 * Minimal Markdown → HTML for curriculum docs.
 * Covers headings, lists, tables, fences, inline code, bold, links, hr, blockquote.
 */
export function markdownToHtml(md: string): string {
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    const out: string[] = [];
    let i = 0;
    let inCode = false;
    let codeLang = "";
    let codeBuf: string[] = [];
    let inUl = false;
    let inOl = false;
    let inTable = false;
    let tableRows: string[][] = [];

    const closeLists = () => {
        if (inUl) {
            out.push("</ul>");
            inUl = false;
        }
        if (inOl) {
            out.push("</ol>");
            inOl = false;
        }
    };

    const flushTable = () => {
        if (!inTable || tableRows.length === 0) return;
        const [header, ...body] = tableRows;
        out.push('<div class="table-wrap"><table>');
        out.push("<thead><tr>");
        header.forEach((c) => out.push(`<th>${inline(c)}</th>`));
        out.push("</tr></thead><tbody>");
        for (const row of body) {
            if (row.every((c) => /^:?-+:?$/.test(c.trim()))) continue;
            out.push("<tr>");
            row.forEach((c) => out.push(`<td>${inline(c)}</td>`));
            out.push("</tr>");
        }
        out.push("</tbody></table></div>");
        inTable = false;
        tableRows = [];
    };

    const inline = (s: string) =>
        s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/`([^`]+)`/g, "<code>$1</code>")
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                '<a href="$2">$1</a>'
            );

    while (i < lines.length) {
        const line = lines[i];

        if (line.startsWith("```")) {
            if (inCode) {
                out.push(
                    `<pre><code class="language-${codeLang}">${escapeHtml(
                        codeBuf.join("\n")
                    )}</code></pre>`
                );
                inCode = false;
                codeBuf = [];
                codeLang = "";
            } else {
                closeLists();
                flushTable();
                inCode = true;
                codeLang = line.slice(3).trim() || "text";
            }
            i++;
            continue;
        }

        if (inCode) {
            codeBuf.push(line);
            i++;
            continue;
        }

        if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
            closeLists();
            inTable = true;
            const cells = line
                .trim()
                .slice(1, -1)
                .split("|")
                .map((c) => c.trim());
            tableRows.push(cells);
            i++;
            continue;
        } else if (inTable) {
            flushTable();
        }

        if (/^---+$/.test(line.trim())) {
            closeLists();
            out.push("<hr />");
            i++;
            continue;
        }

        const h = /^(#{1,4})\s+(.+)$/.exec(line);
        if (h) {
            closeLists();
            const level = h[1].length;
            const id = slugify(h[2]);
            out.push(`<h${level} id="${id}">${inline(h[2])}</h${level}>`);
            i++;
            continue;
        }

        if (line.startsWith("> ")) {
            closeLists();
            out.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`);
            i++;
            continue;
        }

        const ul = /^[-*]\s+(.+)$/.exec(line);
        if (ul) {
            if (inOl) {
                out.push("</ol>");
                inOl = false;
            }
            if (!inUl) {
                out.push("<ul>");
                inUl = true;
            }
            out.push(`<li>${inline(ul[1])}</li>`);
            i++;
            continue;
        }

        const ol = /^(\d+)\.\s+(.+)$/.exec(line);
        if (ol) {
            if (inUl) {
                out.push("</ul>");
                inUl = false;
            }
            if (!inOl) {
                out.push("<ol>");
                inOl = true;
            }
            out.push(`<li>${inline(ol[2])}</li>`);
            i++;
            continue;
        }

        if (line.trim() === "") {
            closeLists();
            i++;
            continue;
        }

        closeLists();
        out.push(`<p>${inline(line)}</p>`);
        i++;
    }

    closeLists();
    flushTable();
    return out.join("\n");
}

function escapeHtml(s: string) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function slugify(s: string) {
    return s
        .toLowerCase()
        .replace(/[^\w\u00C0-\u024f\u1e00-\u1eff\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}
