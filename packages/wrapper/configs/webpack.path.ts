import { join } from 'path';

const rootPath = join(__dirname, '../');

const distPath = join(rootPath, 'dist');
const srcPath = join(rootPath, 'src');
const entryPath = join(rootPath, 'src/index.tsx');
const devEntryPath = join(rootPath, 'src/index-dev.tsx');
const templatePath = join(rootPath, 'index.ejs');

export default {
  entryPath,
  devEntryPath,
  distPath,
  srcPath,
  rootPath,
  templatePath,
};
