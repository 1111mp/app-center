import { version } from './package.json';
import { DeployConfig } from 'deployer';

// {
//   "errorCode": 0,
//   "payload": {
//       "key": "home",
//       "name": "主页",
//       "type": 1,
//       "token": "2dec6b1264bf5eba233b1a3a79e6ada6",
//       "createBy": "66af7ca0a28116d404b4b68b",
//       "owner": "66af7ca0a28116d404b4b68b",
//       "testUsers": [],
//       "versions": [],
//       "admins": [],
//       "_id": "66c1aad2219ba18f9cdd322d",
//       "publishedAt": "2024-08-18T08:03:30.854Z",
//       "createdAt": "2024-08-18T08:03:30.855Z",
//       "updatedAt": "2024-08-18T08:03:30.855Z"
//   }
// }

const config: DeployConfig = {
  version,
  dir: './dist',
  appKey: 'home',
  appToken: '2dec6b1264bf5eba233b1a3a79e6ada6',
  baseUrl: 'http://127.0.0.1:3000/open-api',
  publicPath: 'http://127.0.0.1:3000/api/file/static/home',
  glob: '**/!(route.json|report.html|asset-manifest.json|*.map|*.LICENSE.txt)',
  resourceGlobs: '**/apple*@(.js|.css)',
};

export default config;
