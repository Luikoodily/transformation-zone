// TODO: replace with the real coach's actual methodology/stages before launch.
export type MethodStep = {
  index: string;
  title: string;
  description: string;
};

export const methodSteps: MethodStep[] = [
  { index: "01", title: "Assess", description: "Understand the individual before writing a single set." },
  {
    index: "02",
    title: "Build",
    description: "Technique, mobility, base conditioning — the foundation everything else stands on.",
  },
  { index: "03", title: "Progress", description: "Structured, progressive overload — on schedule." },
  { index: "04", title: "Sustain", description: "Habits and systems that outlast the program." },
];

export const trustStats = [
  { label: "Years Experience", value: "8+" },
  { label: "Clients Trained", value: "350+" },
  { label: "Certified Coach", value: "" },
  { label: "Personalized Programs", value: "" },
];
