type CategoryIconProps = {
  icon: string;
  className?: string;
};

export default function CategoryIcon({ icon, className }: CategoryIconProps) {
  const shared = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (icon) {
    case "embroidery":
      return (
        <svg {...shared} width={32} height={32} strokeWidth={1.75}>
          {/* Escudo */}
          <path d="M12 2.5 4.5 6v5.5c0 4.6 3.2 8.5 7.5 10 4.3-1.5 7.5-5.4 7.5-10V6L12 2.5z" />
          {/* Contorno bordado */}
          <path
            d="M12 5.2 8 7.2v3.8c0 2.6 1.8 4.9 4 6 2.2-1.1 4-3.4 4-6V7.2L12 5.2z"
            strokeDasharray="2.2 1.4"
          />
          {/* Motivo en cruz (punto cruz) */}
          <path d="M10.2 9.8 13.8 14.6" strokeDasharray="1.6 1.1" />
          <path d="M13.8 9.8 10.2 14.6" strokeDasharray="1.6 1.1" />
          <circle cx="12" cy="12.2" r="0.9" />
        </svg>
      );
    case "ads-sign-poster":
      return (
        <svg {...shared}>
          <path d="M2 3h20" />
          <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
          <path d="m7 21 5-5 5 5" />
        </svg>
      );
    case "picture-frame":
      return (
        <svg {...shared}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      );
    case "tshirt-printing":
      return (
        <svg {...shared}>
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
          <rect x="9" y="8" width="6" height="5" rx="1" />
        </svg>
      );
    case "id-card":
      return (
        <svg {...shared}>
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <circle cx="8" cy="12" r="2" />
          <path d="M13 10h5" />
          <path d="M13 14h5" />
        </svg>
      );
    case "multifunction-printer":
      return (
        <svg {...shared}>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
          <rect x="6" y="14" width="12" height="8" rx="1" />
        </svg>
      );
    case "uniform-tie":
      return (
        <svg {...shared}>
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
          <path d="M12 8v8" />
          <path d="M10 16h4l-1 4h-2l-1-4z" />
        </svg>
      );
    case "merchandising":
      return (
        <svg {...shared} width={32} height={32}>
          <path d="M5 6h10" />
          <path d="M5 6v10.5c0 1.5 1.2 2.7 2.7 2.7h4.6c1.5 0 2.7-1.2 2.7-2.7V6" />
          <path d="M15 8c2.9 0 4.6 1.8 4.6 4.3s-1.7 4.3-4.6 4.3" />
        </svg>
      );
    case "envelope-paper":
      return (
        <svg {...shared}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "award":
      return (
        <svg {...shared}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case "rubber-stamp":
      return (
        <svg {...shared}>
          <path d="M11 9.5C10.2 9 9.8 7.5 9.8 6.2C9.8 4.5 10.7 3.2 12 3.2C13.3 3.2 14.2 4.5 14.2 6.2C14.2 7.5 13.8 9 13 9.5" />
          <path d="M11 9.5v6" />
          <path d="M13 9.5v6" />
          <path d="M9.5 15.5h5" />
          <path d="M5 19V15.8a2.5 2.5 0 0 1 2.5-2.5h9a2.5 2.5 0 0 1 2.5 2.5V19" />
          <path d="M6 19h12v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V19" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...shared}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case "laser-engravings-machine":
      return (
        <svg {...shared}>
          <path d="M4 4h16" />
          <path d="M10 4 12 12 14 4" />
          <path d="M12 12v6" />
          <path d="M4 18h16" />
          <path d="M12 18h5" />
        </svg>
      );
    default:
      return (
        <svg {...shared}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
  }
}
