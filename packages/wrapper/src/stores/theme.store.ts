import { useMemo } from 'react';
import { createStore } from '@the1111mp/simple-store';
import { Theme } from '@/utils/theme.util';

type ThemeStore = {
  theme: Theme;
};

const [themeStore] = createStore<ThemeStore>(() => {
  const theme = (localStorage.getItem('APP_THEME') as Theme) ?? Theme.System;

  return {
    theme,
  };
});

export function useThemeStore() {
  const [{ theme }, updateStore] = themeStore((store) => [store.theme]);

  const updateTheme = useMemo(
    () => (theme: Theme) => {
      localStorage.setItem('APP_THEME', theme);
      updateStore((store) => ({ ...store, theme }));
    },
    [theme]
  );

  return {
    theme,
    updateTheme,
  };
}
