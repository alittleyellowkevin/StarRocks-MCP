import { StarRocksConfig, StarRocksConnection as IStarRocksConnection, QueryResult } from '../types/index.js';
export declare class StarRocksConnection implements IStarRocksConnection {
    private connection;
    private config;
    constructor(config: StarRocksConfig);
    connect(): Promise<void>;
    query(sql: string, params?: any[]): Promise<QueryResult>;
    execute(sql: string, params?: any[]): Promise<QueryResult>;
    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    close(): Promise<void>;
    ping(): Promise<boolean>;
    isConnected(): Promise<boolean>;
}
//# sourceMappingURL=StarRocksConnection.d.ts.map