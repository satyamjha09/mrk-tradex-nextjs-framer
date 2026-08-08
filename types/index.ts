export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
  category: string;
  views: string;
  creatorName: string;
  creatorAvatar: string;
  conversionBoost: string;
  duration: string;
}

export type LayoutMode = 'arc' | 'cylinder' | 'perspective' | 'ribbon';

export interface CurvedReelConfig {
  arcDepth: number;
  speed: number;
  layoutMode: LayoutMode;
  autoPlay: boolean;
  soundEnabled: boolean;
}
