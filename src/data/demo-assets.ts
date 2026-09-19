/**
 * DEMO ASSET MANIFEST — pilot/pitch build only.
 *
 * Every image in this pilot is a licensed Unsplash stock photo. There is
 * ZERO original business photography in this build (no real gym photos, no
 * real coach, no real clients) — only the TZ logo (an inline SVG brand mark,
 * not a photograph) is real. None of these represent the real coach, real
 * clients, real results, or real certifications. Replace each entry with the
 * matching real business photo before this site goes live — see
 * REPLACEMENT_NOTES below.
 *
 * To swap the whole set later: point these paths at /images/real/... — no
 * component changes required, every section reads from this file only.
 */

export const demoAssets = {
  hero: {
    src: "/images/demo/hero/coaching-session.jpg",
    alt: "Demo photo — coach and client in conversation at a gym",
    credit: "Unsplash",
  },
  coachPortrait: {
    src: "/images/demo/coach/portrait.jpg",
    alt: "Demo photo — personal trainer portrait (not the real coach)",
    credit: "Unsplash",
  },
  coachTraining: {
    src: "/images/demo/coach/training-detail.jpg",
    alt: "Demo photo — coach and client training moment",
    credit: "Unsplash",
  },
  // 2 slots, matching the Coach section's existing circular composition.
  sessionMoments: [
    {
      src: "/images/demo/coach/training-detail.jpg",
      alt: "Demo photo — coaching interaction (reused from Coach section)",
      credit: "Unsplash",
    },
    {
      src: "/images/demo/session-moments/form-correction.jpg",
      alt: "Demo photo — form correction moment between trainer and client",
      credit: "Unsplash",
    },
  ],
  methodDetail: {
    src: "/images/demo/method/barbell-detail.jpg",
    alt: "Demo photo — hand gripping a barbell",
    credit: "Unsplash",
  },
  programs: {
    personalTraining: {
      src: "/images/demo/gym/equipment.jpg",
      alt: "Demo photo — gym training area",
      credit: "Unsplash",
    },
    fatLoss: {
      src: "/images/demo/programs/fat-loss.jpg",
      alt: "Demo photo — training session",
      credit: "Unsplash",
    },
    strength: {
      src: "/images/demo/programs/strength.jpg",
      alt: "Demo photo — barbell strength training",
      credit: "Unsplash",
    },
    onlineCoaching: {
      src: "/images/demo/programs/online-coaching.jpg",
      alt: "Demo photo — training plan on a tablet beside gym equipment",
      credit: "Unsplash",
    },
  },
  // Same single demo image used for both before/after slots on purpose — using two
  // different stock photos would visually imply a specific fabricated transformation.
  resultsDemo: {
    src: "/images/demo/results/demo-progress.jpg",
    alt: "Demo photo — athletic training (not a real client transformation)",
    credit: "Unsplash",
  },
  gym: {
    wide: {
      src: "/images/demo/gym/wide.jpg",
      alt: "Demo photo — gym interior with power rack and free weights",
      credit: "Unsplash",
    },
    equipment: {
      src: "/images/demo/gym/equipment.jpg",
      alt: "Demo photo — gym equipment and weight machines",
      credit: "Unsplash",
    },
  },
  credentialsDetail: {
    src: "/images/demo/credentials/equipment-detail.jpg",
    alt: "Demo photo — gym equipment detail",
    credit: "Unsplash",
  },
  testimonialAvatar: {
    src: "/images/demo/testimonial/avatar.jpg",
    alt: "Demo photo — generic portrait, not the real client",
    credit: "Unsplash",
  },
  testimonialBackground: {
    src: "/images/demo/gym/wide.jpg",
    alt: "Demo photo — gym interior",
    credit: "Unsplash",
  },
} as const;

/**
 * REPLACEMENT_NOTES — what each demo asset should become once real photography
 * is available. Keep this list in sync with demoAssets above.
 */
export const REPLACEMENT_NOTES = [
  "hero.src → replace with a real photo of the actual coach training or coaching a client",
  "coachPortrait.src → replace with the real coach's portrait",
  "coachTraining.src → replace with a real coach + client training photo",
  "sessionMoments[0..1].src → replace with real candid training/coaching moments from Transformation Zone Gym",
  "methodDetail.src → optional: replace with a real detail shot from Transformation Zone Gym (chalk, plates, bar)",
  "programs.personalTraining.src → replace with a real 1:1 session photo",
  "programs.fatLoss.src → replace with a real training photo, ideally from an actual session",
  "programs.strength.src → replace with a real strength-training photo from the gym",
  "programs.onlineCoaching.src → replace with a real remote-coaching visual if offered",
  "resultsDemo.src (both before/after slots) → replace with an approved, consented real client transformation — never fabricate the pairing",
  "gym.wide.src / gym.equipment.src → replace with the real gym's own interior photography",
  "credentialsDetail.src → replace with a real close-up of the certificate wall once a clean, legible photo exists",
  "testimonialAvatar.src → replace with the real client's photo, only with their consent",
  "testimonialBackground.src → replace with a real training-floor photo",
  "Location section (still a placeholder, not in this manifest) → needs a real exterior/entrance photo; no stock option matched the gym's aesthetic closely enough to use as a stand-in",
] as const;
