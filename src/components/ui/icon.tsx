import {
    Rocket,
    Terminal,
    GitBranch,
    Container,
    Workflow,
    FlaskConical,
    Sparkles,
    BookOpen,
    MessageSquare,
    Briefcase,
    ShieldCheck,
    Bot,
    Flag,
    type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
    Rocket,
    Terminal,
    GitBranch,
    Container,
    Workflow,
    FlaskConical,
    Sparkles,
    BookOpen,
    MessageSquare,
    Briefcase,
    ShieldCheck,
    Bot,
    Flag,
};

export function Icon({
    name,
    className,
    strokeWidth = 1.75,
}: {
    name: string;
    className?: string;
    strokeWidth?: number;
}) {
    const Cmp = map[name] ?? BookOpen;
    return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden />;
}
