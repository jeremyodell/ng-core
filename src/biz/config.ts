export interface BizConfig {
  routes?: string[];
  apps: { [id: string]: any };
  server?: BizServerConfig;
}

export interface BizServerConfig {
  disableServerSideRender: boolean;
}
