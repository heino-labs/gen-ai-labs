import { cn } from "@/lib/cn";

export function AuroraBackground({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
                className
            )}
            aria-hidden
        >
            {/* base wash */}
            <div className="absolute inset-0 bg-[var(--bg)]" />

            <div
                className="aurora-blob animate-aurora-1 left-[-12%] top-[-18%] h-[42vw] w-[42vw]"
                style={{
                    background:
                        "radial-gradient(circle at 30% 30%, #7c5cff, transparent 70%)",
                }}
            />
            <div
                className="aurora-blob animate-aurora-2 right-[-14%] top-[-8%] h-[38vw] w-[38vw]"
                style={{
                    background:
                        "radial-gradient(circle at 60% 40%, #22d3ee, transparent 70%)",
                }}
            />
            <div
                className="aurora-blob animate-aurora-3 left-[28%] top-[-6%] h-[34vw] w-[34vw]"
                style={{
                    background:
                        "radial-gradient(circle at 50% 50%, #f472b6, transparent 72%)",
                }}
            />

            <div className="absolute inset-0 bg-grid-fade [background-size:46px_46px] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_60%)]" />

            <div className="absolute inset-x-0 top-[34vh] bottom-0 bg-gradient-to-b from-transparent via-[var(--bg)] to-[var(--bg)]" />
        </div>
    );
}
