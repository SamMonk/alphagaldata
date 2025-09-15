import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size?: number) => ({
  width: size ?? 20,
  height: size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconFlask({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M10 2v4l-5 9a5 5 0 0 0 4.5 7h5A5 5 0 0 0 19 15l-5-9V2" />
      <path d="M8 6h8" />
    </svg>
  );
}

export function IconMapPin({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M12 22s8-7.2 8-12a8 8 0 1 0-16 0c0 4.8 8 12 8 12z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function IconCart({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function IconStethoscope({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M6 4v5a6 6 0 0 0 12 0V4" />
      <path d="M8 15a5 5 0 0 0 8 0" />
      <circle cx="20" cy="10" r="2" />
      <path d="M22 10v6a4 4 0 0 1-4 4h-2" />
    </svg>
  );
}

export function IconExternal({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

export function IconInfo({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function IconLabcorp({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <rect x="7" y="2" width="10" height="3" rx="1" />
      <path d="M9 5v5l-2 6a4 4 0 0 0 3.8 5h2.4A4 4 0 0 0 17 16l-2-6V5" />
    </svg>
  );
}

export function IconQuest({ size, ...props }: IconProps) {
  return (
    <svg {...base(size)} {...props}>
      <circle cx="12" cy="12" r="7" />
      <path d="M16 16l3 3" />
    </svg>
  );
}

export default {
  IconFlask,
  IconMapPin,
  IconCart,
  IconStethoscope,
  IconExternal,
  IconInfo,
  IconLabcorp,
  IconQuest,
};

