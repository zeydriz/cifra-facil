export interface Hymn {
  id: string;
  title: string;
  number?: number;
  category: string;
  key?: string; // tonalidade
  lyrics: string;
  chords?: string;
  isFavorite: boolean;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HymnCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
}