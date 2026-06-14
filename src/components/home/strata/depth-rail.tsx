import { useCallback, useMemo } from "react";
import type { Category } from "@/lib/content";
import { hashSeed } from "./seed";

export interface RailStop {
    category: Category;
    depthStart: number;
}

/* =========================================================================
   SEISMOGRAPH RAIL — the most unique depth indicator on the web.

   The left rail is a live seismograph paper roll:
   ┌──────────────────────┐
   │  /\/\/\  ← waveform  │  each stratum = distinct geological signature
   │ ─────── ← boundary   │  (different freq/amplitude, seeded from slug)
   │  ~~~◆~~  ← scan line │  the drill head sweeps down as you scroll
   │  ………………             │  below = undrilled (faint dotted trace)
   └──────────────────────┘

   Waveform path: computed in normalised SVG coords (0 0 80 1000),
   preserveAspectRatio="none" → y scales to viewport, x stays pixel-perfect.
   All layout elements (overlay buttons) use % top → align with SVG.
   ========================================================================= */

const W = 80; // rail width in px
const CX = W * 0.62; // centre axis of waveform, slight right-bias for room on left

/** Build a seismic waveform SVG path in 80×1000 space. */
function buildSeismicPath(stops: RailStop[], totalDepth: number): string {
    const N = 500;
    const pts: string[] = [];

    for (let i = 0; i <= N; i++) {
        const t = i / N;
        const depth = t * totalDepth;

        // Find the active stratum at this depth
        let slug = "surface";
        for (let j = stops.length - 1; j >= 0; j--) {
            if (depth >= stops[j].depthStart) {
                slug = stops[j].category.slug;
                break;
            }
        }

        // Each stratum has a unique waveform signature derived from its slug
        const h = hashSeed(slug);
        const p1 = (h & 0x7ff) / 325;          // phase 1  [0, 2π]
        const p2 = ((h >> 11) & 0x7ff) / 325;  // phase 2
        const f1 = 5 + (h & 0xf);              // freq 1   [5, 20]
        const f2 = 2 + ((h >> 16) & 0x7);      // freq 2   [2, 9]
        const a1 = 8 + (h & 0x7);              // amp 1    [8, 15]
        const a2 = 3 + ((h >> 5) & 0x5);       // amp 2    [3, 7]

        const x =
            CX +
            Math.sin(t * f1 * Math.PI * 2 + p1) * a1 +
            Math.sin(t * f2 * Math.PI * 2 * 1.618 + p2) * a2;

        const y = t * 1000;
        pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
    }

    return pts.join(" ");
}

// ── Gradient colour stops for the drilled section ──────────────────────────
function GradientStops({ stops, totalDepth }: { stops: RailStop[]; totalDepth: number }) {
    return (
        <>
            <stop offset="0%" stopColor="var(--muted)" stopOpacity="0.25" />
            {stops.map((s) => (
                <stop
                    key={s.category.slug}
                    offset={`${((s.depthStart / totalDepth) * 100).toFixed(2)}%`}
                    stopColor={s.category.accent[0]}
                />
            ))}
            <stop
                offset="100%"
                stopColor={stops[stops.length - 1]?.category.accent[1] ?? "#f472b6"}
            />
        </>
    );
}

// ── Component ───────────────────────────────────────────────────────────────
export function DepthRail({
    stops,
    totalDepth,
    depth,
    progress,
    active,
}: {
    stops: RailStop[];
    totalDepth: number;
    depth: number;
    progress: number;
    active: string | null;
}) {
    const waveformPath = useMemo(
        () => buildSeismicPath(stops, totalDepth),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [stops.map((s) => s.category.slug).join(","), totalDepth]
    );

    const activeStop = stops.find((s) => active === `stratum-${s.category.slug}`);
    const drillY = progress * 1000; // in SVG units

    const jump = useCallback((slug: string) => {
        document
            .getElementById(`stratum-${slug}`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    return (
        <>
            {/* ── Global darkness veil — deepens as you descend ──────── */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 z-[5] bg-black transition-opacity duration-500"
                style={{ opacity: progress * 0.28 }}
            />

            {/* ── SEISMOGRAPH RAIL (desktop only) ───────────────────── */}
            <nav
                aria-label="Strata depth gauge"
                className="fixed inset-y-0 left-0 z-30 hidden overflow-visible md:block"
                style={{
                    width: `${W}px`,
                    borderRight: "1px solid var(--border)",
                    background:
                        "linear-gradient(to right, var(--bg-soft) 50%, transparent 100%)",
                }}
            >
                {/* ── Seismograph SVG ── */}
                <svg
                    viewBox={`0 0 ${W} 1000`}
                    preserveAspectRatio="none"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden
                >
                    <defs>
                        {/* Multi-colour gradient — each stratum has its own colour */}
                        <linearGradient
                            id="sg-grad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1000"
                            gradientUnits="userSpaceOnUse"
                        >
                            <GradientStops stops={stops} totalDepth={totalDepth} />
                        </linearGradient>

                        {/* Clip masks for drilled / undrilled sections */}
                        <clipPath id="sg-drilled">
                            <rect x="0" y="0" width={W} height={drillY} />
                        </clipPath>
                        <clipPath id="sg-future">
                            <rect x="0" y={drillY} width={W} height={1000 - drillY} />
                        </clipPath>

                        {/* Glow filter for scan line & drill head */}
                        <filter id="sg-glow" x="-80%" y="-400%" width="260%" height="900%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Softer glow for category dots */}
                        <filter id="sg-dot" x="-120%" y="-120%" width="340%" height="340%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* ── Background axis line ── */}
                    <line
                        x1={CX}
                        y1="0"
                        x2={CX}
                        y2="1000"
                        stroke="var(--border)"
                        strokeWidth="1"
                        opacity="0.5"
                    />

                    {/* ── Waveform — future / undrilled (faint dotted) ── */}
                    <path
                        d={waveformPath}
                        fill="none"
                        stroke="var(--muted)"
                        strokeWidth="1"
                        strokeDasharray="3 5"
                        clipPath="url(#sg-future)"
                        opacity="0.2"
                    />

                    {/* ── Waveform — drilled (coloured gradient, solid) ── */}
                    <path
                        d={waveformPath}
                        fill="none"
                        stroke="url(#sg-grad)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        clipPath="url(#sg-drilled)"
                        opacity="0.85"
                    />

                    {/* ── Stratum boundary horizontal rules ── */}
                    {stops.map((s) => {
                        const y = (s.depthStart / totalDepth) * 1000;
                        const isActive = active === `stratum-${s.category.slug}`;
                        return (
                            <line
                                key={`rule-${s.category.slug}`}
                                x1="0"
                                y1={y}
                                x2={W}
                                y2={y}
                                stroke={s.category.accent[0]}
                                strokeWidth={isActive ? 1.5 : 0.75}
                                strokeDasharray={isActive ? "none" : "4 4"}
                                opacity={isActive ? 0.65 : 0.25}
                            />
                        );
                    })}

                    {/* ── Scan line — drill head position ── */}
                    {progress > 0 && (
                        <g filter="url(#sg-glow)">
                            <line
                                x1="0"
                                y1={drillY}
                                x2={W}
                                y2={drillY}
                                stroke="#22d3ee"
                                strokeWidth="1.5"
                            />
                            {/* drill-bit diamond */}
                            <g transform={`translate(${CX},${drillY})`}>
                                <rect
                                    x="-4"
                                    y="-4"
                                    width="8"
                                    height="8"
                                    fill="#22d3ee"
                                    transform="rotate(45)"
                                />
                            </g>
                        </g>
                    )}

                    {/* ── Category dots on axis ── */}
                    {stops.map((s) => {
                        const y = (s.depthStart / totalDepth) * 1000;
                        const drilled = s.depthStart / totalDepth <= progress;
                        const isActive = active === `stratum-${s.category.slug}`;
                        return (
                            <circle
                                key={`dot-${s.category.slug}`}
                                cx={CX}
                                cy={y}
                                r={isActive ? 5 : 3.5}
                                fill={drilled ? s.category.accent[0] : "var(--bg-soft)"}
                                stroke={s.category.accent[0]}
                                strokeWidth="1.5"
                                opacity={isActive ? 1 : drilled ? 0.75 : 0.3}
                                filter={isActive ? "url(#sg-dot)" : undefined}
                            />
                        );
                    })}
                </svg>

                {/* ── Depth tick labels (left of axis) ── */}
                {stops.map(({ category: c, depthStart }) => (
                    <div
                        key={`lbl-${c.slug}`}
                        aria-hidden
                        className="pointer-events-none absolute font-mono tabular-nums"
                        style={{
                            top: `${(depthStart / totalDepth) * 100}%`,
                            right: `${W - CX + 6}px`,
                            transform: "translateY(-50%)",
                            fontSize: "9px",
                            color: "var(--muted)",
                            opacity: 0.55,
                            letterSpacing: "0.05em",
                        }}
                    >
                        {depthStart}
                    </div>
                ))}

                {/* ── Interactive overlay: jump buttons ── */}
                {stops.map(({ category: c, depthStart }) => {
                    const isActive = active === `stratum-${c.slug}`;
                    return (
                        <button
                            key={`btn-${c.slug}`}
                            onClick={() => jump(c.slug)}
                            aria-label={`${c.title} · −${depthStart} m`}
                            className="ring-focus group absolute left-0 right-0 flex h-10 cursor-pointer items-center"
                            style={{
                                top: `${(depthStart / totalDepth) * 100}%`,
                                transform: "translateY(-50%)",
                                opacity: c.status === "live" ? 1 : 0.45,
                            }}
                        >
                            {/* Flyout tooltip — slides out to the right of the rail */}
                            <span
                                className="pointer-events-none absolute flex min-w-max items-center gap-2 rounded-lg border px-3 py-2 opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100"
                                style={{
                                    left: `${W + 8}px`,
                                    background: "var(--bg-soft)",
                                    borderColor: `${c.accent[0]}50`,
                                    boxShadow: `0 8px 32px ${c.accent[0]}28, 0 0 0 1px ${c.accent[0]}18`,
                                    transform: "translateX(-4px)",
                                    transition:
                                        "opacity 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
                                }}
                                /* group-hover re-applies transform via CSS directly below */
                            >
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                        background: c.accent[0],
                                        boxShadow: `0 0 8px ${c.accent[0]}`,
                                    }}
                                />
                                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--fg-soft)]">
                                    {c.title}
                                </span>
                                <span className="font-mono text-[9px] tabular-nums text-[var(--muted)]">
                                    −{depthStart} m
                                </span>
                                {isActive && (
                                    <span
                                        className="ml-1 rounded-full px-1.5 py-px font-mono text-[8px] uppercase tracking-widest"
                                        style={{
                                            background: `${c.accent[0]}22`,
                                            color: c.accent[0],
                                            border: `1px solid ${c.accent[0]}44`,
                                        }}
                                    >
                                        active
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* ── INSTRUMENT PANEL — depth readout ──────────────── */}
            <div
                className="pointer-events-none fixed bottom-5 z-30 select-none"
                style={{ left: "1rem" }}
            >
                <div
                    className="relative overflow-hidden rounded-xl"
                    style={{
                        background: "linear-gradient(135deg, #04040e 0%, #08081a 100%)",
                        border: "1px solid #ffffff10",
                        boxShadow:
                            "0 0 0 1px #ffffff06, 0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 #ffffff08",
                        minWidth: "148px",
                    }}
                >
                    {/* Accent colour bar at top edge */}
                    <div
                        className="absolute left-0 right-0 top-0 h-px transition-colors duration-500"
                        style={{
                            background: activeStop
                                ? `linear-gradient(90deg, transparent, ${activeStop.category.accent[0]}, transparent)`
                                : "linear-gradient(90deg, transparent, #22d3ee55, transparent)",
                        }}
                    />

                    <div className="px-4 pb-4 pt-3">
                        {/* Label */}
                        <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#2d2f4a]">
                            bit depth
                        </div>

                        {/* The big number */}
                        <div className="mt-1 flex items-end gap-1.5">
                            <span
                                className="font-mono text-[1.6rem] font-bold leading-none tabular-nums"
                                style={{
                                    color: "#c8eeff",
                                    letterSpacing: "0.06em",
                                    textShadow: "0 0 20px rgba(34,211,238,0.35)",
                                }}
                            >
                                −{String(depth).padStart(4, "0")}
                            </span>
                            <span className="mb-0.5 font-mono text-xs text-[#2d2f4a]">m</span>
                        </div>

                        {/* Progress fill bar */}
                        <div
                            className="mt-3 h-[3px] rounded-full overflow-hidden"
                            style={{ background: "#0d0d22" }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-150"
                                style={{
                                    width: `${progress * 100}%`,
                                    background: activeStop
                                        ? `linear-gradient(90deg, #22d3ee, ${activeStop.category.accent[0]})`
                                        : "linear-gradient(90deg, #22d3ee, #7c5cff)",
                                    boxShadow: activeStop
                                        ? `0 0 8px ${activeStop.category.accent[0]}80`
                                        : "0 0 8px rgba(34,211,238,0.5)",
                                }}
                            />
                        </div>

                        {/* Active stratum indicator */}
                        <div
                            className="mt-2.5 flex min-h-[18px] items-center gap-2 transition-all duration-300"
                        >
                            {activeStop ? (
                                <>
                                    <span
                                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                                        style={{
                                            background: activeStop.category.accent[0],
                                            boxShadow: `0 0 6px ${activeStop.category.accent[0]}`,
                                            animation: "pulse 2s ease-in-out infinite",
                                        }}
                                    />
                                    <span
                                        className="font-mono text-[9px] uppercase tracking-[0.3em]"
                                        style={{ color: activeStop.category.accent[0] }}
                                    >
                                        {activeStop.category.title}
                                    </span>
                                </>
                            ) : (
                                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#1e2035]">
                                    surface
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
