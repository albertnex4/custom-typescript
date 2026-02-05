import React from 'react';
import { IconWrapper, IconProps } from '../../components/base/IconWrapper';

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

export const Door: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M5 20V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
    <path d="M15 12h.01" strokeWidth="3" />
  </IconWrapper>
);

export const Gear: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0a2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2a2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83a2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2a2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0a2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </IconWrapper>
);

export const Engine: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M14 13h-4V9h4v4Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
    <path d="M21 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    <circle cx="12" cy="13" r="3" />
  </IconWrapper>
);

export const CarDoor: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M4 10V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V10L17 4H7L4 10Z" />
    <path d="M6 10H18M10 4V10M14 4V10" strokeOpacity="0.5" />
    <rect x="15" y="13" width="3" height="1.5" rx="0.5" fill="currentColor" />
  </IconWrapper>
);

export const Lock: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </IconWrapper>
);

export const Unlock: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 9-2" />
  </IconWrapper>
);

export const Lights: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M3 12h5m-5-6h4m-4 12h4" strokeOpacity="0.5" />
    <path d="M21 12c0 4.4-3.6 8-8 8h-2V4h2c4.4 0 8 3.6 8 8Z" />
  </IconWrapper>
);

export const Climate: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
    <path d="m4.9 4.9 2.9 2.9m8.4 8.4 2.9 2.9m0-14.2-2.9 2.9M7.8 16.2l-2.9 2.9" />
  </IconWrapper>
);

export const CarLocation: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" fill="currentColor" fillOpacity="0.2" />
  </IconWrapper>
);

/*
export const Fuel: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M3 22h12M4 7h10M4 11h10" />
    <rect x="4" y="2" width="10" height="20" rx="2" />
    <path d="m14 7 3-3a2 2 0 0 1 3 0v10" />
  </IconWrapper>
);
*/

//Ni tan mal...
export const Fuel: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M453.351,241.312v-5.443a1.87,1.87,0,0,0-.279-.947,21.322,21.322,0,0,0-2.013-2.783c-.578-.729-1.175-1.439-1.772-2.139l-.1-.114a.341.341,0,0,0-.549,0,.56.56,0,0,0,0,.672c.433.5.867,1.013,1.291,1.533l.395.473v3.161a.707.707,0,0,0,.048.322c0,.057.077.114.106.17l.318.473,1.06,1.6.722,1.089v5.206h0v.085a1.455,1.455,0,0,1,0,.218,1.086,1.086,0,0,1-.048.189v.057h0v.066l-.087.18a.348.348,0,0,1-.048.1c0,.047-.067.1,0,0l-.135.18-.067.076h0l-.173.142a.517.517,0,0,0-.1.057h-.058l-.221.076h-.212a1.385,1.385,0,0,1-.279,0h-.164l-.2-.066h0a.4.4,0,0,1-.327.095.564.564,0,0,1-.154-.114c-.029-.047.067.076,0,0h0l-.077-.095-.048-.066h0c0-.057-.067-.114-.1-.18a1.357,1.357,0,0,1-.067-.18h0v-.095a1.553,1.553,0,0,0-.087-.35c-.029-.114,0-.1,0-.161h0V240.99a3.884,3.884,0,0,0-.048-.672,2.236,2.236,0,0,0-.819-1.382,2.5,2.5,0,0,0-1.6-.341v-8.519a.874.874,0,0,0-.771-.947h-8.389a.884.884,0,0,0-.78.947v17.511H436.4v1.543h12.136v-1.543h-1.088v-8.168h.809l.231.076h.125s.144.076.164.133-.067-.076,0,0h0l.048.066.058.076h0c0,.1.1.2.135.3a.129.129,0,0,1,0,.057v.265h0v3.966a3.9,3.9,0,0,0,.482,1.685,1.741,1.741,0,0,0,1.531,1.1,2.107,2.107,0,0,0,1.926-1.06,3.566,3.566,0,0,0,.443-1.779C453.351,243.262,453.351,242.258,453.351,241.312Zm-7.195-4.354a.58.58,0,0,1-.51.634h-6.357a.58.58,0,0,1-.51-.634v-5.386a.58.58,0,0,1,.51-.634h6.357a.58.58,0,0,1,.51.634ZM449.142,240.621Zm3.294,4.562v-.057s-.048.019-.048.038Zm.144-9.408v2.1l-1.329-2.007-.154-.227v-2.111c.337.435.665.88.963,1.354l.193.284v.066a1.02,1.02,0,0,1,.077.142c0,.076.087.151.125.227l.048.1h0v.057h0Z" transform="translate(-436.4 -229.13)"></path>
  </IconWrapper>
);

export const Horn: React.FC<IconProps> = (props) => (
  <IconWrapper {...props}>
    <path d="M11 5 6 9H2v6h4l5 4V5Z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeOpacity="0.4" />
  </IconWrapper>
);