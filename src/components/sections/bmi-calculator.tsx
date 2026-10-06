"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/data/location";

type Unit = "metric" | "imperial";

// WHO adult categories.
function category(bmi: number): { label: string; tip: string } {
  if (bmi < 18.5) return { label: "Underweight", tip: "A strength and nutrition plan can help you build healthy mass." };
  if (bmi < 25) return { label: "Healthy weight", tip: "Great range — keep building strength and stamina." };
  if (bmi < 30) return { label: "Overweight", tip: "A mix of strength training and cardio works well here." };
  return { label: "Obese", tip: "A guided plan with a trainer is the safest way to start." };
}

export function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [height, setHeight] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const inch = parseFloat(inches) || 0;

  const heightM = unit === "metric" ? h / 100 : (h * 12 + inch) * 0.0254;
  const weightKg = unit === "metric" ? w : w * 0.45359237;
  const valid = heightM > 0.5 && heightM < 2.8 && weightKg > 10 && weightKg < 500;
  const bmi = valid ? weightKg / (heightM * heightM) : null;
  const result = bmi ? category(bmi) : null;

  const input =
    "w-full border border-line bg-paper px-3 py-3 font-body text-sm text-ink outline-none focus:border-accent-ink";

  return (
    <section id="bmi" className="bg-paper-2 px-6 py-14 md:px-14 md:py-[100px]">
      <SectionLabel className="mb-2">Know your number</SectionLabel>
      <h2 className="mb-6 font-display text-2xl text-ink md:mb-8 md:text-[44px]">Adult BMI calculator.</h2>

      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="grid content-start gap-4">
          <div className="flex gap-2" role="group" aria-label="Units">
            {(["metric", "imperial"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                aria-pressed={unit === u}
                className={`rounded-full border px-4 py-2 font-body text-xs font-bold uppercase ${
                  unit === u ? "border-ink bg-ink text-paper" : "border-line text-ink"
                }`}
              >
                {u === "metric" ? "cm / kg" : "ft / lb"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 font-body text-xs font-bold text-ink-soft uppercase">
              {unit === "metric" ? "Height (cm)" : "Height (ft)"}
              <input className={input} inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} />
            </label>
            {unit === "imperial" && (
              <label className="grid gap-1 font-body text-xs font-bold text-ink-soft uppercase">
                Inches
                <input className={input} inputMode="decimal" value={inches} onChange={(e) => setInches(e.target.value)} />
              </label>
            )}
            <label className="grid gap-1 font-body text-xs font-bold text-ink-soft uppercase">
              {unit === "metric" ? "Weight (kg)" : "Weight (lb)"}
              <input className={input} inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </label>
          </div>
          <p className="font-body text-[11.5px] text-ink-soft italic">
            For adults 18+. BMI is a screening guide, not a diagnosis — it doesn&rsquo;t account for muscle mass.
          </p>
        </div>

        <div className="border border-line bg-paper p-6" aria-live="polite">
          {bmi && result ? (
            <>
              <p className="font-body text-xs font-extrabold tracking-[0.2em] text-accent-ink uppercase">Your BMI</p>
              <p className="font-display text-6xl text-ink md:text-7xl">{bmi.toFixed(1)}</p>
              <p className="font-display text-2xl text-accent-ink">{result.label}</p>
              <p className="mt-2 font-body text-sm text-ink-soft">{result.tip}</p>
              <Button
                href={whatsappUrl(`Hi, my BMI is ${bmi.toFixed(1)} (${result.label}). I'd like a personalised plan.`)}
                className="mt-5"
              >
                Get a plan on WhatsApp
              </Button>
            </>
          ) : (
            <p className="font-body text-sm text-ink-soft">Enter your height and weight to see your BMI.</p>
          )}
          <p className="mt-5 font-body text-[11px] text-ink-soft">
            Under 18.5 underweight · 18.5–24.9 healthy · 25–29.9 overweight · 30+ obese
          </p>
        </div>
      </div>
    </section>
  );
}
