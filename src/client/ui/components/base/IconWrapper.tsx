import React from 'react';

// Tipado para los iconos
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

// Icon Wrapper para mantener consistencia
export const IconWrapper: React.FC<IconProps> = ({
  size = 26,
  color = "currentColor",
  children,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    shapeRendering="geometricPrecision"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
);