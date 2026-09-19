export type Program = {
  index: string;
  title: string;
  description: string;
};

// TODO: confirm real program lineup with the coach before launch
export const programs: Program[] = [
  {
    index: "01",
    title: "Personal Training",
    description:
      "1:1 coaching, customized workouts, hands-on form correction, progress tracking — every session.",
  },
  {
    index: "02",
    title: "Fat Loss & Transformation",
    description:
      "Structured programming and nutrition guidance for sustainable, measurable change.",
  },
  {
    index: "03",
    title: "Strength & Muscle Building",
    description:
      "Progressive overload programming for clients focused on long-term strength gains.",
  },
  {
    index: "04",
    title: "Online Coaching",
    description: "Remote programming and check-ins for clients training anywhere.",
  },
];
