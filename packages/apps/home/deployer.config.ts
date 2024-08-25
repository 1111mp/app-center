import { version } from './package.json';
import { DeployConfig } from 'deployer';

const config: DeployConfig = {
	version,
	dir: './dist',
	appKey: 'home',
	appToken: '2dec6b1264bf5eba233b1a3a79e6ada6',
	baseUrl: 'http://127.0.0.1:3000/open-api',
	publicPath: 'http://127.0.0.1:3000/api/file/static/home',
	glob: '**/!(route.json|report.html|asset-manifest.json|*.map|*.LICENSE.txt)',
	resourceGlobs: '**/home*@(.js|.css)',
};

export default config;
