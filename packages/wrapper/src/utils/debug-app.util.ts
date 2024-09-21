const DEBUG_APP_KEY = 'DEBUG_APP',
  DEBUG_APP_ENTRY = 'debug_entry';

function jsonParse<T = any>(data: string | null): T | undefined {
  if (typeof data !== 'string') return void 0;

  return JSON.parse(data);
}

export function getDebugApp(): MicroApp | undefined {
  let debugApp = jsonParse<MicroApp>(sessionStorage.getItem(DEBUG_APP_KEY));

  try {
    if (!debugApp && location.search) {
      const search = new URL(location.href).searchParams;
      const entry = search.get(DEBUG_APP_ENTRY)
        ? search.getAll(DEBUG_APP_ENTRY)
        : search.getAll(`${DEBUG_APP_ENTRY}[]`);
      const resources = (Array.isArray(entry) ? entry : [entry]).map((entry) =>
        decodeURIComponent(entry)
      );

      debugApp = {
        key: 'debug',
        name: '本地调试应用',
        prefix: '/debug',
        logo: require('../../assets/icons/debug.png').default,
        resources,
      };

      sessionStorage.setItem(DEBUG_APP_KEY, JSON.stringify(debugApp));
    }
  } catch {}

  return debugApp;
}
