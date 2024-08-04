declare global {
	interface Window {
		__POWERED_BY_QIANKUN__?: boolean;
		__INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
	}
}

declare let __webpack_public_path__: string | undefined;

export {};

if (window.__POWERED_BY_QIANKUN__) {
	// eslint-disable-next-line no-undef
	__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
