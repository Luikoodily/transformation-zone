// Real: name, address, hours, WhatsApp number. Instagram still a DUMMY placeholder — replace before launch.
export const location = {
  name: "Transformation Zone Gym",
  address: "7RVW+72X, 2, Saheed Nagar, Bhubaneswar, Odisha 751007, India",
  hours: "Mon-Sat · 6AM-10PM · Sun · 5PM-9PM",
  whatsapp: "+91 81390 55920",
  // TODO: confirm real Instagram handle
  instagram: "@transformationzone",
  directionsUrl: "#", // TODO: real Google Maps link
};

/** Builds a wa.me deep link with an optional prefilled message. */
export function whatsappUrl(message?: string): string {
  const number = location.whatsapp.replace(/\D/g, "");
  return message
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${number}`;
}

export type DayHours = {
  day: string;
  opens: string;
  closes: string;
};

// Real weekly hours (source: gym's WhatsApp Business profile).
export const schedule: DayHours[] = [
  { day: "MON", opens: "6 AM", closes: "10 PM" },
  { day: "TUE", opens: "6 AM", closes: "10 PM" },
  { day: "WED", opens: "6 AM", closes: "10 PM" },
  { day: "THU", opens: "6 AM", closes: "10 PM" },
  { day: "FRI", opens: "6 AM", closes: "10 PM" },
  { day: "SAT", opens: "6 AM", closes: "10 PM" },
  { day: "SUN", opens: "5 PM", closes: "9 PM" },
];
