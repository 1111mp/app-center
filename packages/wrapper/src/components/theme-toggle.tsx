import { useEffect } from 'react';
import { Button } from 'ui-library';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'ui-library';
import { useThemeStore } from '@/stores/app.store';
import { applyTheme, MEDIA, Theme } from '@/utils/theme.util';

export function ThemeToggle() {
  const { theme, updateTheme } = useThemeStore();

  useEffect(() => {
    const media = window.matchMedia(MEDIA);
    const listener = (e: MediaQueryListEvent) => {
      if (theme === Theme.System) {
        applyTheme(e.matches ? Theme.Light : Theme.Dark);
      }
    };
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [theme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 px-0'>
          <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => updateTheme(Theme.Light)}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateTheme(Theme.Dark)}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateTheme(Theme.System)}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
