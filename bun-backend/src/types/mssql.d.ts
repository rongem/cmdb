declare module 'mssql' {
  export interface config {
    server: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    options?: {
      encrypt?: boolean;
      trustServerCertificate?: boolean;
      enableArithAbort?: boolean;
    };
    pool?: {
      max?: number;
      min?: number;
      idleTimeoutMillis?: number;
    };
  }

  export class ConnectionPool {
    connected: boolean;
    constructor(config: config);
    connect(): Promise<void>;
    close(): Promise<void>;
    request(): Request;
  }

  export class Request {
    query(query: string): Promise<{ recordset: any[] }>;
  }

  const sql: {
    ConnectionPool: typeof ConnectionPool;
    config: config;
  };

  export default sql;
}
