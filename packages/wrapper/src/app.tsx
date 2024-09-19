import { useEffect, useRef } from 'react';
import { registerMicroApps, start } from 'qiankun';
import { Header } from './components';

import { useAppStore } from './stores/apps.store';
import { Button } from 'ui-library';
import { NotFound } from './components/not-found';

export const App: React.FC = () => {
	const { activeApp, appListMap, updateActiveApp } = useAppStore();

	const pointer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (Object.keys(appListMap).length && pointer.current) {
			registerMicroApps(
				Object.keys(appListMap).map((key) => {
					const app = appListMap[key];
					const resources = app.resources || [];
					const entry = resources.reduce<AppEntry>(
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
	}, [appListMap]);

	useEffect(() => {
		if (location.pathname === '/') {
			history.replaceState({}, '', '/home');
			return;
		}

		const apps = Object.values(appListMap);
		if (!apps.length) return;

		const matched = apps.find(
			(app) => app.prefix && location.pathname.startsWith(app.prefix)
		);
		console.log('matched', matched);

		if (matched) {
			updateActiveApp(matched.key);

			document.title = `${matched.name ? `${matched.name}-` : ''}App Center`;
			const favicon = document.querySelector<HTMLLinkElement>('#favicon-link');
			if (matched.logo && favicon) {
				favicon.href = matched.logo ?? ''; // todo upload default favicon url
			}
		}
	}, [appListMap]);

	// const onLoginHandle = () => {
	//   const url = `http://localhost:3000/api/oauth/github?redirect=${encodeURIComponent(window.location.href)}`;
	//   window.location.href = url;
	// };

	return (
		<div className='relative min-h-screen flex flex-col bg-background'>
			<Header />
			<main ref={pointer} className='flex-1'>
				{renderExtraContent()}
			</main>
		</div>
	);

	function renderExtraContent() {
		if (!activeApp && location.pathname !== '/')
			return (
				<div className='flex flex-col items-center pt-64 gap-2'>
					<NotFound />
					<p className='text-2xl font-bold'>404</p>
					<Button
						onClick={() => {
							history.replaceState({}, '', '/home');
						}}
					>
						返回主页
					</Button>
				</div>
			);

		return null;
	}
};
