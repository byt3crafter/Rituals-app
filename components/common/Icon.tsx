import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { theme } from '@/styles/theme';

interface IconProps {
  name: 'timer' | 'chart' | 'sparkles' | 'settings' | 'flame' | 'droplet' | 'bolt' | 'key' | 'recycle';
  color?: string;
  size?: number;
}

// Professional icon paths based on popular icon libraries (Lucide/Feather style)
const iconPaths: { [key in IconProps['name']]: string } = {
  // Clock/Timer icon
  timer: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 10V7h-2v6h5v-2h-3z",
  
  // Bar chart icon
  chart: "M3 3v18h18M7 14v5M12 9v10M17 6v13",
  
  // Sparkles/Stars icon (improved)
  sparkles: "M12 2l1.09 3.26L16.5 6.36l-3.41.81L12 10.5l-1.09-3.33L7.5 6.36l3.41-.81L12 2zm-5 10l.82 2.46L10.5 15l-2.68.64L7 18.1l-.82-2.46L3.5 15l2.68-.64L7 12zm10 0l.82 2.46L20.5 15l-2.68.64L17 18.1l-.82-2.46L13.5 15l2.68-.64L17 12z",
  
  // Settings/Gear icon
  settings: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.98l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z",
  
  // Flame/Fire icon (sleeker design)
  flame: "M13.5 2c-.28 0-.5.22-.5.5 0 1.93-1.57 3.5-3.5 3.5-.28 0-.5.22-.5.5s.22.5.5.5C12.43 7 15 9.57 15 12.5c0 .83-.67 1.5-1.5 1.5S12 13.33 12 12.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5C11 14.43 9.43 16 7.5 16c-.28 0-.5.22-.5.5s.22.5.5.5C10.54 17 13 19.46 13 22.5c0 .28.22.5.5.5s.5-.22.5-.5c0-3.04 2.46-5.5 5.5-5.5.28 0 .5-.22.5-.5s-.22-.5-.5-.5c-1.93 0-3.5-1.57-3.5-3.5 0-2.93-2.07-5.38-4.83-5.95C12.62 4.56 14 2.5 14 2.5c0-.28-.22-.5-.5-.5z",
  
  // Water droplet icon
  droplet: "M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69zm0 2.83l-4.24 4.24a6 6 0 108.49 0L12 5.52z",
  
  // Lightning bolt icon
  bolt: "M13 2L3 14h8l-1 8 10-12h-8l1-8z",
  
  // Key icon (more detailed)
  key: "M17 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM7 2L2 7v3l3 3h3l1-1h2l1-1h2l1-1 1-1V7l-5-5H7zm1.5 6C7.67 8 7 7.33 7 6.5S7.67 5 8.5 5 10 5.67 10 6.5 9.33 8 8.5 8z",
  
  // Recycle/Refresh icon
  recycle: "M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
};

const Icon: React.FC<IconProps> = ({ name, color = theme.colors.onSurface, size = 24 }) => {
  return (
    <Svg 
      height={size} 
      width={size} 
      viewBox="0 0 24 24"
      fill="none"
      stroke="none"
    >
      <Path fill={color} d={iconPaths[name]} />
    </Svg>
  );
};

export default Icon;