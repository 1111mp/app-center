/**
 * Only for local development environment
 */

import { useEffect, useRef } from 'react';
import { registerMicroApps, start } from 'qiankun';
import { Header } from './header';

export const App: React.FC = () => {
  const pointer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerMicroApps([
      {
        name: 'home',
        entry: '//localhost:4001',
        container: pointer.current!,
        activeRule: (location) => {
          return location.pathname.startsWith('/home');
        },
      },
      {
        name: 'developer-center',
        entry: '//localhost:4002',
        container: pointer.current!,
        activeRule: (location) => {
          return location.pathname.startsWith('/developer-center');
        },
      },
    ]);

    start({ prefetch: false });
  }, []);

  return (
    <div>
      <Header />
      <div ref={pointer}></div>
    </div>
  );
};
