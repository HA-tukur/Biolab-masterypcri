interface AntibodyIconProps {
  size?: number;
  className?: string;
}

export const AntibodyIcon: React.FC<AntibodyIconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="6" cy="20" r="2" />
      <circle cx="18" cy="20" r="2" />
      <circle cx="12" cy="4" r="2" />
      <path d="M6 18 L12 6 L18 18" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  );
};
