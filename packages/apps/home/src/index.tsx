import './public-path';
import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { App } from './app';

interface MicroAppProps {
	container?: HTMLElement;
	[key: string]: any; // 这样可以允许其他可能的属性
}

let root: Root;

function render(props: MicroAppProps) {
	const { container } = props;
	root = createRoot(
		(container
			? container.querySelector('#root')
			: document.querySelector('#root')) as HTMLElement
	);
	root.render(
		<StrictMode>
			<App />
		</StrictMode>
	);
}

if (!window.__POWERED_BY_QIANKUN__) {
	render({});
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
	console.log('[apple] app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: MicroAppProps) {
	console.log('[apple] props from main framework', props);
	render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
	console.log('[apple] app unmount');
	root && root.unmount();
}
