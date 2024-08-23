import { Resource } from './app-version.type';

export enum AppType {
  Micro = 1,
}

export interface AppData {
  /// basic info
  id: string;
  key: string;
  name: string;
  type: number;
  logo?: string;
  prefix: string;
  createBy?: string;
  testUsers?: string[];
  startLocation?: string;
  publishedAt?: number;

  /// current version info
  version?: string;
  resources?: Resource;
  config?: any;
  versionCreateAt?: number;

  /// test version info
  testVersion?: string;
  testConfig?: any;
  testResources?: Resource;
  testVersionCreateAt?: number;

  isTest?: boolean;
}
