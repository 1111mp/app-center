import { registerMicroApps, start } from 'qiankun';
import { useEffect, useRef } from 'react';

type MicroApp = {
  key: string;
  name: string;
  prefix: string;
  resources: string[];
};

type Entry = {
  scripts: string[];
  styles: string[];
  html?: string;
};

export const App: React.FC = () => {
  const pointer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const appList: MicroApp[] = (window as any).APP_LIST || [];
    if (appList.length && pointer.current) {
      registerMicroApps(
        appList.map((app) => {
          const resources = app.resources || [];
          const entry = resources.reduce<Entry>(
            (entry, resource) => {
              if (resource.endsWith('.js')) {
                entry.scripts.push(resource);
              } else if (resource.endsWith('.css')) {
                entry.styles.push(resource);
              } else {
                entry.html = resource;
              }

              return entry;
            },
            { scripts: [], styles: [], html: `<div id="root"></div>` }
          );

          return {
            name: app.name,
            entry,
            container: pointer.current!,
            activeRule: (location) => {
              return location.pathname.startsWith(app.prefix);
            },
          };
        })
      );

      start({ prefetch: false });
    }
  }, []);

  const onLoginHandle = () => {
    const url = `http://localhost:3000/api/oauth/github?redirect=${encodeURIComponent(window.location.href)}`;
    window.location.href = url;
  };

  return (
    <div>
      main
      <button onClick={onLoginHandle}>login</button>
      <ul>
        <li
          className='text-red-500'
          onClick={() => {
            history.pushState(null, '/home', '/home');
          }}
        >
          home
        </li>
        <li
          onClick={() => {
            history.pushState(null, '/developer-center', '/developer-center');
          }}
        >
          developer-center
        </li>
      </ul>
      <div ref={pointer}></div>
    </div>
  );
};
