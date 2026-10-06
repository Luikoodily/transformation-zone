export type AnnouncementKindValue = "HOLIDAY" | "EVENT" | "NOTICE" | "INSTAGRAM";

export const ANNOUNCEMENT_KINDS: { value: AnnouncementKindValue; label: string; hint: string }[] = [
  { value: "HOLIDAY", label: "Holiday / closure", hint: "e.g. Gym closed on 25 December" },
  { value: "EVENT", label: "Event", hint: "e.g. Zumba party, cricket match" },
  { value: "NOTICE", label: "Notice", hint: "e.g. new timings, offers" },
  { value: "INSTAGRAM", label: "Instagram post", hint: "Paste the post link" },
];

export function kindLabel(kind: AnnouncementKindValue): string {
  return ANNOUNCEMENT_KINDS.find((k) => k.value === kind)?.label ?? kind;
}
