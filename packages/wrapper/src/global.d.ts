type MicroApp = {
	key: string;
	name: string;
	prefix: string;
	logo: string;
	resources: string[];
};

type AppEntry = {
	scripts: string[];
	styles: string[];
	html?: string;
};

interface Window {
	APP_LIST: MicroApp[];
}
