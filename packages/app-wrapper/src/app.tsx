import {
  registerMicroApps,
  runAfterFirstMounted,
  setDefaultMountApp,
  start,
} from 'qiankun';
import { useEffect, useRef } from 'react';

type MicroApp = {
  key: string;
  name: string;
  pathPrefix: string;
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
            { scripts: [], styles: [], html: undefined }
          );

          return {
            name: app.name,
            entry,
            container: pointer.current!,
            activeRule: (location) => {
              return location.pathname.startsWith(app.pathPrefix);
            },
          };
        })
      );

      start({ prefetch: false });
    }
  }, []);

  return (
    <div>
      main
      <ul>
        <li
          className='text-red-500'
          onClick={() => {
            history.pushState(null, '/apple', '/apple');
          }}
        >
          apple
        </li>
        <li
          onClick={() => {
            history.pushState(null, '/orange', '/orange');
          }}
        >
          orange
        </li>
      </ul>
      <div ref={pointer}></div>
    </div>
  );
};
