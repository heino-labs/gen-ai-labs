import React, { useState, useId } from "react";
import { HelpCircle, CheckCircle2, XCircle } from "lucide-react";

const SEQ = { 0: "A", 1: "B", 2: "C", 3: "D", 4: "E", 5: "F" };

/**
 * Reusable inline quiz for guides (great for the upcoming Unit Testing track).
 * Usage in MDX:
 *   <QuizComponent name="Question?" answers={["a","b"]} correctAnswer="a" />
 */
const QuizComponent = ({ name = "Quick check", answers = [], correctAnswer }) => {
    const [selected, setSelected] = useState("");
    const [index, setIndex] = useState(-1);
    const [result, setResult] = useState(null);
    const uid = useId();

    const check = () => setResult(selected === correctAnswer ? "correct" : "wrong");

    return (
        <div className="glass mx-auto my-8 max-w-md rounded-2xl p-6">
            <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[var(--fg)]">
                <HelpCircle className="h-5 w-5 text-aurora-violet" />
                Time for a quick quiz!
            </h3>
            <p className="text-sm font-medium text-[var(--fg-soft)]">{name}</p>

            <div className="mt-5 space-y-2.5">
                {answers.map((answer, i) => (
                    <label
                        key={i}
                        htmlFor={`${uid}-${i}`}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] px-3 py-2 text-sm transition-colors hover:border-brand/50"
                    >
                        <input
                            id={`${uid}-${i}`}
                            type="radio"
                            name={uid}
                            value={answer}
                            checked={selected === answer}
                            onChange={() => {
                                setResult(null);
                                setSelected(answer);
                                setIndex(i);
                            }}
                            className="h-4 w-4 accent-[var(--brand)]"
                        />
                        <span className="text-[var(--fg-soft)]">
                            <strong className="text-[var(--fg)]">{SEQ[i]}.</strong> {answer}
                        </span>
                    </label>
                ))}
            </div>

            <div className="mt-4 text-right">
                <button
                    onClick={check}
                    className="rounded-lg bg-aurora-grad px-4 py-1.5 text-sm font-semibold text-white shadow-glow"
                >
                    Check answer
                </button>
            </div>

            {result && (
                <div
                    className={`mt-4 flex items-center gap-2 text-sm font-semibold ${
                        result === "correct" ? "text-aurora-teal" : "text-aurora-pink"
                    }`}
                >
                    {result === "correct" ? (
                        <CheckCircle2 className="h-4 w-4" />
                    ) : (
                        <XCircle className="h-4 w-4" />
                    )}
                    You picked {SEQ[index] || "—"}.{" "}
                    {result === "correct" ? "Correct! 🎉" : "Not quite — try again."}
                </div>
            )}
        </div>
    );
};

export default QuizComponent;
