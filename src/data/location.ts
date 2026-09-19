// Real: name, hours, WhatsApp number. Address/Instagram still DUMMY placeholders — replace before launch.
export const location = {
  name: "Transformation Zone Gym",
  // TODO: confirm real street address
  address: "[GYM ADDRESS, CITY]",
  hours: "Mon–Sat · 6AM–10PM",
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

export const schedule: { day: string; slots: { time: string; open: boolean }[] }[] = [
  { day: "MON", slots: [{ time: "6 AM", open: true }, { time: "6 PM", open: false }] },
  { day: "TUE", slots: [{ time: "6 AM", open: false }, { time: "6 PM", open: true }] },
  { day: "WED", slots: [{ time: "6 AM", open: true }, { time: "6 PM", open: false }] },
  { day: "THU", slots: [{ time: "6 AM", open: false }, { time: "6 PM", open: true }] },
  { day: "FRI", slots: [{ time: "6 AM", open: true }, { time: "6 PM", open: false }] },
  { day: "SAT", slots: [{ time: "6 AM", open: false }, { time: "6 PM", open: false }] },
];
