import { version } from './package.json';
import { DeployConfig } from 'deployer';

const config: DeployConfig = {
	version,
	dir: './dist',
	appKey: 'developer-center',
	appToken: 'd3f1ed0f6de5d01c4e394c302b2b2341',
	baseUrl: 'http://127.0.0.1:3000/open-api',
	publicPath: 'http://127.0.0.1:3000/api/file/static/developer-center',
	glob: '**/!(route.json|report.html|asset-manifest.json|*.map|*.LICENSE.txt)',
	resourceGlobs: '**/developer-center*@(.js|.css)',
};

export default config;
