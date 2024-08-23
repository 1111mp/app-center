import { createRequire } from 'node:module';
import { join } from 'node:path';

export interface DeployConfig {
	appKey?: string;
	appToken?: string;
	version?: string;
	dir?: string;
	baseUrl: string;
	publicPath: string;
	glob?: string | string[];
	resourceGlobs?: string | string[];
	proxy?: string;
	note?: string;
	extra?: Record<string, string>;
}

export async function getDefaultConfig(
	cwd: string
): Promise<Partial<DeployConfig>> {
	return {
		appKey: process.env.APP_KEY,
		appToken: process.env.APP_TOKEN,
		dir: './dist',
		version: await getVersion(cwd),
		glob: '**/*',
		resourceGlobs: '**/index*@(.js|.css)',
		note: 'Automatically published by Deployer',
	};
}

async function getVersion(cwd: string) {
	const require = createRequire(import.meta.url);
	const packageJson = require(join(cwd, 'package.json'));
	return packageJson.version;
}
