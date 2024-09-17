/**
 * Only for local development environment
 */

import { useEffect, useRef } from 'react';
import { registerMicroApps, start } from 'qiankun';
import { Header } from '@/components';

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
    <div className='relative min-h-screen flex flex-col bg-background'>
      <Header />
      <main ref={pointer} className='flex-1'></main>
    </div>
  );
};
