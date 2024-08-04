import { join } from 'path';

const rootPath = join(__dirname, '../');

const distPath = join(rootPath, 'dist');
const entryPath = join(rootPath, 'src/index.tsx');
const templatePath = join(rootPath, 'index.ejs');

export default {
	entryPath,
	distPath,
	rootPath,
	templatePath,
};
