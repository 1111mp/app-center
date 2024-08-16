export interface AppVersion {
  version: string;
  resources: Resource;
  desc?: string;
  createAt: number;
  config: Record<string, string>;
}

export interface CoreAppVersion {
  version: string;
  resources: Resource;
  config: Record<string, string>;
}

export type Resource =
  | string[]
  | {
      scripts?: string[];
      styles?: string[];
      html?: string;
    };
