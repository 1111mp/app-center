import { cac } from 'cac';
import pico from 'picocolors';
import { configResolver } from 'lib-configuration-resolver';
import { deploy } from './deploy';
import { version } from '../package.json';
import { DeployConfig, getDefaultConfig } from './config.util';

const cli = cac('deployer');

interface CLIOptions {
	'--'?: string[];
	config?: string;
}

cli
	.command('[...files]', 'Files to upload')
	.option(
		'-c, --config <file>',
		`[string] use specified config file (default 'deployer.config')`,
		{
			default: 'deployer.config',
		}
	)
	.action(async (files, options: CLIOptions) => {
		console.log('files', files);
		const cwd = process.cwd();
		console.log('cwd', cwd);
		const defaultConfig = await getDefaultConfig(cwd);
		const { config } = await configResolver<DeployConfig>(options.config);
		const deployConfig = Object.assign(defaultConfig, config);
		console.log('deployConfig', deployConfig);

		/// check appKey & appToken
		if (!deployConfig.appKey || !deployConfig.appToken) {
			console.log(
				pico.bold(
					pico.red(
						'Please provide the appKey and appToken that you want to publish the application'
					)
				)
			);
			return;
		}

		/// check baseUrl
		if (!defaultConfig.baseUrl) {
			console.log(
				pico.bold(pico.red("The server address 'baseUrl' cannot be empty"))
			);
			return;
		}

		console.log(
			pico.bold(
				pico.blue('Welcome to use Deployer to publish your application')
			)
		);

		await deploy(cwd, deployConfig);
	});

cli.help();
cli.version(version);

cli.parse();

export { DeployConfig };
