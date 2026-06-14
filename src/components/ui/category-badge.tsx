import { cn } from "@/lib/cn";

export function CategoryBadge({
    label,
    accent,
    className,
}: {
    label: string;
    accent?: [string, string];
    className?: string;
}) {
    const [from, to] = accent ?? ["#7c5cff", "#22d3ee"];
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
                className
            )}
            style={{
                borderColor: `${from}44`,
                background: `linear-gradient(120deg, ${from}1f, ${to}1f)`,
                color: from,
            }}
        >
            <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
            />
            {label}
        </span>
    );
}

export function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="glass rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[var(--muted)]">
            {children}
        </span>
    );
}
