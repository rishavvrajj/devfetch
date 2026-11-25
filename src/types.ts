export type ModuleResult<T> = {
  available: boolean;
  data?: T;
  error?: string;
};

export type SystemInfo = {
  os: string;
  kernel: string;
  shell: string;
  terminal: string;
  uptime: string;
  cpu: string;
  memory: string;
};

export type ToolInfo = {
  name: string;
  version: string;
};

export type ProjectInfo = {
  name: string;
  packageManager: string;
  framework: string;
  dependencies: number;
  devDependencies: number;
};

export type GitInfo = {
  branch: string;
  dirtyFiles: number;
  ahead: number;
  behind: number;
  lastCommit: string;
  lastCommitTime: string;
};

export type SecurityInfo = {
  envFile: boolean;
  envExample: boolean;
  envIgnored: boolean | "unknown";
  lockfile: string;
  possibleSecrets: number;
  secretFiles: string[];
  nodeVersionPinned: boolean;
};

export type DevFetchData = {
  system: ModuleResult<SystemInfo>;
  tools: ModuleResult<ToolInfo[]>;
  project: ModuleResult<ProjectInfo>;
  git: ModuleResult<GitInfo>;
  security: ModuleResult<SecurityInfo>;
};
