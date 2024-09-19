import { createStore } from '@the1111mp/simple-store';
import { getDebugApp } from '@/utils/debug-app.util';

type AppStore = {
	activeApp?: string;
	appList: MicroApp[];
	debugApp?: MicroApp;
	appListMap: Record<string, MicroApp>;
};

export const [appStore] = createStore<AppStore>(() => {
	const appList = window.APP_LIST ?? [];
	const debugApp = getDebugApp();
	const appListMap: Record<string, MicroApp> = {};

	if (debugApp) {
		appListMap[debugApp.key] = debugApp;
	}

	for (const app of appList) {
		appListMap[app.key] = app;
	}

	return {
		appList,
		debugApp,
		appListMap,
	};
});

export function useAppStore() {
	const [{ activeApp, appListMap }, updateAppStore] = appStore((store) => [
		store.activeApp,
		store.appListMap,
	]);

	const updateActiveApp = (activeApp: string) => {
		updateAppStore((store) => ({ ...store, activeApp }));
	};

	return {
		activeApp,
		appListMap,
		updateActiveApp,
	};
}
