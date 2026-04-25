declare module 'localtunnel' {
  interface TunnelOptions {
    port: number;
    subdomain?: string;
    host?: string;
    local_host?: string;
    local_https?: boolean;
    allow_invalid_cert?: boolean;
  }

  interface Tunnel {
    url: string;
    close(): void;
    on(event: 'close', callback: () => void): void;
  }

  function localtunnel(options: TunnelOptions): Promise<Tunnel>;

  export = localtunnel;
}
