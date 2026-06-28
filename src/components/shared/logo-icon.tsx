interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className = "w-5 h-5" }: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <path
        d="M16 2L4 7v9c0 6.5 5.1 12.6 12 14 6.9-1.4 12-7.5 12-14V7L16 2z"
        fill="#0a0a0a"
        stroke="#22c55e"
        strokeWidth="1.5"
      />
      <polyline
        points="6,16 10,16 12,11 14,21 16,14 18,18 20,16 26,16"
        fill="none"
        stroke="#22c55e"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
