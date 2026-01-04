import React from 'react';

export const IconWrapper: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = 28, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <g fill="currentColor">{children}</g>
  </svg>
);