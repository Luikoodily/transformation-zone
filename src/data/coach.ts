// DUMMY DATA — placeholder only. Replace every field before launch.
export type Coach = {
  name: string;
  title: string;
  yearsExperience: number;
  clientsTrained: string;
  bio: string[];
  specialties: string[];
};

export const coach: Coach = {
  // TODO: replace with real coach name
  name: "Kwame Owusu",
  title: "Personal Training",
  // TODO: confirm real years of experience
  yearsExperience: 8,
  // TODO: confirm real client count
  clientsTrained: "350+",
  bio: [
    "Kwame Owusu is an 8-year strength & conditioning coach based at Transformation Zone Gym. Every plan starts from an assessment, not a template.",
  ],
  specialties: ["Strength", "Fat Loss", "Performance"],
};
