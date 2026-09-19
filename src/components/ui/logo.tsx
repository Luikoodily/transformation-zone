export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 90"
      className={className}
      style={{ color: "var(--logo-gold)" }}
      role="img"
      aria-label="Transformation Zone logo"
    >
      <g fill="currentColor">
        <circle cx="34" cy="22" r="11" />
        <path d="M14 84 C14 46 22 30 38 30 C50 30 58 40 59 52 L59 66 C50 61 42 64 40 71 L40 84 Z" />
        <circle cx="168" cy="20" r="13" />
        <path d="M144 86 C142 44 152 24 170 24 C186 24 196 38 196 54 L196 70 C186 63 176 66 172 74 L172 86 Z" />
      </g>
      <text
        x="100"
        y="66"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="58"
        fill="currentColor"
      >
        TZ
      </text>
    </svg>
  );
}
