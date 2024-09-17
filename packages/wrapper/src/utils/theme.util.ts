export enum Theme {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

export const MEDIA = '(prefers-color-scheme: light)';

export function applyTheme(theme: Theme) {
  if (theme === Theme.System) {
    const themeMedia = window.matchMedia(MEDIA);
    theme = themeMedia.matches ? Theme.Light : Theme.Dark;
  }

  const root = window.document.documentElement;
  if (root.classList.contains(theme)) return;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}
