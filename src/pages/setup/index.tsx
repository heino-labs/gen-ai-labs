import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SetupRedirect() {
    const router = useRouter();
    useEffect(() => {
        void router.replace("/linux/setup");
    }, [router]);
    return (
        <p className="p-10 text-center text-sm text-[var(--muted)]">
            Đang chuyển tới Linux · Setup…
        </p>
    );
}
