import type { ReactNode } from "react";
import { Info, Lightbulb, TriangleAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "info" | "tip" | "warning" | "success";

const config: Record<
    Tone,
    { icon: typeof Info; color: string; bg: string }
> = {
    info: { icon: Info, color: "#22d3ee", bg: "rgba(34,211,238,0.08)" },
    tip: { icon: Lightbulb, color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
    warning: { icon: TriangleAlert, color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
    success: { icon: CheckCircle2, color: "#34d399", bg: "rgba(52,211,153,0.08)" },
};

export function Callout({
    type = "info",
    title,
    children,
}: {
    type?: Tone;
    title?: string;
    children: ReactNode;
}) {
    const { icon: IconCmp, color, bg } = config[type];
    return (
        <div
            className={cn(
                "my-6 flex gap-3 rounded-2xl border p-4 text-[15px] leading-relaxed"
            )}
            style={{ borderColor: `${color}33`, background: bg }}
        >
            <IconCmp className="mt-0.5 h-5 w-5 shrink-0" style={{ color }} />
            <div className="min-w-0">
                {title && (
                    <p className="mb-1 font-semibold" style={{ color }}>
                        {title}
                    </p>
                )}
                <div className="text-[var(--fg-soft)] [&>p]:m-0">{children}</div>
            </div>
        </div>
    );
}
