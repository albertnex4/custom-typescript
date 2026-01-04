import React from 'react';
import { IconWrapper } from '../../components/base/IconWrapper';

export const Wifi: React.FC = () => (
  <IconWrapper>
    <path d="M12 18c.83 0 1.5-.67 1.5-1.5S12.83 15 12 15s-1.5.67-1.5 1.5S11.17 18 12 18z" />
    <path d="M5.05 10.55a9 9 0 0113.9 0l1.41-1.41a11 11 0 00-16.72 0L5.05 10.55z" opacity=".9" />
  </IconWrapper>
);

export const Airplane: React.FC = () => (
  <IconWrapper>
    <path d="M2 16l6-2V8l-2-1 8-4 8 4-2 1v6l6 2-2 2-6-2v-6l-6-2v8l-6 2-2-2z" />
  </IconWrapper>
);

export const Bluetooth: React.FC = () => (
  <IconWrapper>
    <path d="M7 7l10 5-10 5V7zM12 2v4l4 3-4 3v4l8-7-8-7z" />
  </IconWrapper>
);

export const Location: React.FC = () => (
  <IconWrapper>
    <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
  </IconWrapper>
);

export const Sound: React.FC = () => (
  <IconWrapper>
    <path d="M3 10v4h4l5 4V6L7 10H3z" />
  </IconWrapper>
);

export const Brightness: React.FC = () => (
  <IconWrapper>
    <path d="M6.76 4.84l-1.8-1.79L3.17 5l1.79 1.79 1.8-1.95zM1 13h3v-2H1v2zm11 6h2v-3h-2v3zM18.36 6.64l1.8-1.79L20.83 3 19.04 4.79l-1.8 1.85z" />
  </IconWrapper>
);

export const Call: React.FC = () => (
  <IconWrapper>
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.2.5 2.5.77 3.86.77a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 4a1 1 0 011-1h2.5a1 1 0 011 1c0 1.36.27 2.66.77 3.86a1 1 0 01-.21 1.11l-2.44 2.82z" />
  </IconWrapper>
);

export const Message: React.FC = () => (
  <IconWrapper>
    <path d="M20 2H4a2 2 0 00-2 2v20l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
  </IconWrapper>
);

export const Gear: React.FC = () => (
  <svg width={72} height={72} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g fill="#333">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.6-.22l-2.39.96a7.07 7.07 0 00-1.63-.94l-.36-2.54a.5.5 0 00-.5-.42h-3.84a.5.5 0 00-.5.42l-.36 2.54c-.57.22-1.1.52-1.63.94l-2.39-.96a.5.5 0 00-.6.22L2.68 8.88a.5.5 0 00.12.64L4.83 11.1c-.04.31-.06.63-.06.94s.02.63.06.94L2.68 15.56a.5.5 0 00-.12.64l1.92 3.32c.14.24.44.34.7.22l2.39-.96c.5.42 1.06.77 1.63.94l.36 2.54c.05.24.25.42.5.42h3.84c.25 0 .45-.18.5-.42l.36-2.54c.57-.22 1.1-.52 1.63-.94l2.39.96c.26.12.56.02.7-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" />
    </g>
  </svg>
);

export const Engine: React.FC = () => (
  <IconWrapper>
    <path d="M4 9h12l2 3v4h-2v2h-2v-2H8v2H6v-2H4z" />
    <path d="M16 7V5h-2v2H10V5H8v2H4v2h16V7z" opacity=".7" />
  </IconWrapper>
);


export const Door: React.FC = () => (
  <IconWrapper>
    <path d="M6 3l10 2v14l-10 2V3z" />
    <path d="M13 12a1 1 0 100-2 1 1 0 000 2z" opacity=".7" />
  </IconWrapper>
);

export const Lock: React.FC = () => (
  <IconWrapper>
    <path d="M7 10V7a5 5 0 0110 0v3h1v10H6V10h1z" />
  </IconWrapper>
);

export const Unlock: React.FC = () => (
  <IconWrapper>
    <path d="M17 10V7a5 5 0 00-9.5-2H6a7 7 0 0113 2v3z" />
    <path d="M6 10h12v10H6z" />
  </IconWrapper>
);

export const Lights: React.FC = () => (
  <IconWrapper>
    <path d="M4 8h6l2 4-2 4H4z" />
    <path d="M14 9l4-1M14 12h4M14 15l4 1" opacity=".6" />
  </IconWrapper>
);

export const Climate: React.FC = () => (
  <IconWrapper>
    <path d="M12 2v20M4 6l16 12M4 18L20 6" />
  </IconWrapper>
);

export const CarLocation: React.FC = () => (
  <IconWrapper>
    <path d="M12 2c-4 0-7 3-7 7 0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
    <path d="M8 11h8l-1-3H9z" opacity=".7" />
  </IconWrapper>
);

export const Fuel: React.FC = () => (
  <IconWrapper>
    <path d="M6 4h8v16H6z" />
    <path d="M14 6h2l2 3v7a2 2 0 01-2 2h-2z" opacity=".8" />
  </IconWrapper>
);

export const Horn: React.FC = () => (
  <IconWrapper>
    <path d="M4 10h6l6-4v12l-6-4H4z" />
    <path d="M18 9c1 1 1 5 0 6" opacity=".6" />
  </IconWrapper>
);
