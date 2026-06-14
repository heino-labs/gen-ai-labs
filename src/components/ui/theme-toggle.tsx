import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isDark = resolvedTheme === "dark";

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "ring-focus glass relative grid h-9 w-9 place-items-center rounded-xl text-[var(--fg)] transition-colors hover:text-brand",
                className
            )}
        >
            {mounted ? (
                isDark ? (
                    <Sun className="h-[18px] w-[18px]" strokeWidth={1.9} />
                ) : (
                    <Moon className="h-[18px] w-[18px]" strokeWidth={1.9} />
                )
            ) : (
                <span className="h-[18px] w-[18px]" />
            )}
        </button>
    );
}
