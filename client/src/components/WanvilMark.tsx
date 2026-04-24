export function WanvilMark({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 5.5H5.5V18.5H8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 5.5H18.5V18.5H16"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="8.75" y="8.75" width="6.5" height="6.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}
