import { useLocalStorage } from './useLocalStorage';
import { AppSettings } from '@/types/hymn';

const defaultSettings: AppSettings = {
  theme: 'light',
  fontSize: 'medium'
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', defaultSettings);

  const updateTheme = (theme: 'light' | 'dark') => {
    setSettings(prev => ({ ...prev, theme }));
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const updateFontSize = (fontSize: AppSettings['fontSize']) => {
    setSettings(prev => ({ ...prev, fontSize }));
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-sm';
      case 'medium': return 'text-base';
      case 'large': return 'text-lg';
      case 'extra-large': return 'text-xl';
      default: return 'text-base';
    }
  };

  return {
    settings,
    updateTheme,
    updateFontSize,
    getFontSizeClass
  };
}