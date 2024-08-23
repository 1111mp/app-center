import { join } from 'node:path';
import { glob } from 'glob';
import pico from 'picocolors';
import axios, { type AxiosInstance } from 'axios';
import type { DeployConfig } from './config.util';
import { createReadStream } from 'node:fs';
import FormData from 'form-data';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import pLimit from 'p-limit';

export async function deploy(cwd: string, config: DeployConfig) {
	/// validate app version
	await validateAppVersion(config);

	/// upload files
	await uploadFiles(cwd, config);

	/// create ap version
	await createAppVersion(cwd, config);
}

async function uploadFiles(cwd: string, config: DeployConfig) {
	const baseDir = join(cwd, config.dir);
	const files = await readDir(baseDir, config.glob);
	console.log('files', files);
	const limit = pLimit(3);
	const uploadPromises = files.map((file) =>
		uploadFile(
			config.baseUrl,
			join(baseDir, file),
			file,
			config.appKey,
			config.appToken,
			config.proxy
		)
	);
	await Promise.all(uploadPromises);
}

async function uploadFile(
	baseUrl: string,
	fileFullPath: string,
	filePath: string,
	appKey: string,
	appToken: string,
	proxy?: string
): Promise<void> {
	try {
		const fileName = filePath.split('/').pop() || 'unknown';

		const formData = new FormData();
		formData.append('file', createReadStream(fileFullPath), fileName);
		formData.append('filePath', filePath);

		let agent = void 0;
		if (proxy) {
			agent = baseUrl.startsWith('https')
				? new HttpsProxyAgent(proxy)
				: new HttpProxyAgent(proxy);
		}

		const response = await axios.post(`${baseUrl}/file/upload`, formData, {
			headers: {
				...formData.getHeaders(),
				'app-private-key': appKey,
				'app-private-token': appToken,
			},
			httpAgent: agent,
			httpsAgent: agent,
		});

		console.log(`File uploaded successfully: ${fileName}`, response.data);
	} catch (error) {
		console.error(`Error uploading file ${filePath}: ${error.message}`);
	}
}

async function readDir(dir: string, pattern: string | string[] = '**/*') {
	return glob(pattern, {
		cwd: dir,
		root: dir,
		nodir: true,
	});
}

async function createAppVersion(cwd: string, config: DeployConfig) {
	const resources = (
		await readDir(join(cwd, config.dir), config.resourceGlobs)
	).map((filename) => `${config.publicPath}/${filename}`);

	console.log(pico.green(`find ${resources.length} resources:`));
	resources.forEach((resource) => {
		console.log(pico.green(`find entry resource: ${resource}`));
	});

	let agent = void 0;
	if (config.proxy) {
		agent = config.baseUrl.startsWith('https')
			? new HttpsProxyAgent(config.proxy)
			: new HttpProxyAgent(config.proxy);
	}
	await axios.post(
		`${config.baseUrl}/app/create-version`,
		{
			version: config.version,
			resources,
			desc: config.note,
			config: config.extra,
		},
		{
			headers: {
				'app-private-key': config.appKey,
				'app-private-token': config.appToken,
			},
			httpAgent: agent,
			httpsAgent: agent,
		}
	);

	console.log(
		pico.green(
			`app ${config.appKey} publish success, version is ${config.version}`
		)
	);
}

async function validateAppVersion(config: DeployConfig) {
	console.log(
		pico.green(
			`Start verifying whether the application version is available: ${config.appKey} ${config.version}`
		)
	);
	let agent = void 0;
	if (config.proxy) {
		agent = config.baseUrl.startsWith('https')
			? new HttpsProxyAgent(config.proxy)
			: new HttpProxyAgent(config.proxy);
	}
	await axios.get(`${config.baseUrl}/app/validate-version`, {
		params: { version: config.version },
		headers: {
			'app-private-key': config.appKey,
			'app-private-token': config.appToken,
		},
		httpAgent: agent,
		httpsAgent: agent,
	});
	console.log(pico.green(`version ${config.version} available`));
}
