type MicroApp = {
	key: string;
	name: string;
	prefix: string;
	logo: string;
	entryServer?: string;
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
