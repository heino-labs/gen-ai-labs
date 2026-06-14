/* =========================================================================
   STRATA — deterministic randomness.
   Everything "organic" on the page (jagged boundaries, specimen tilt)
   is derived from content hashes, never Math.random(): SSR-safe and
   stable between builds. Chaos with rules.
   ========================================================================= */

/** FNV-1a 32-bit hash */
export function hashSeed(s: string): number {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

/** LCG pseudo-random sequence from a seed → values in [0,1) */
export function seededSeq(seed: number): () => number {
    let s = seed || 1;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

/** Jagged stratum boundary as an SVG path (filled below the jag). */
export function jaggedPath(key: string, w = 1200, h = 40, segs = 26): string {
    const rnd = seededSeq(hashSeed(key));
    const pts: string[] = [];
    for (let i = 0; i <= segs; i++) {
        const x = (i / segs) * w;
        const y = 6 + rnd() * (h - 12);
        pts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return `M0 ${h} ${pts.join(" ")} L${w} ${h} Z`;
}

/** Small deterministic tilt in degrees, in [-0.9, 0.9] */
export function tiltFor(key: string): number {
    return ((hashSeed(key) % 19) - 9) / 10;
}
