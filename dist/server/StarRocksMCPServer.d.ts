import { StarRocksConfig } from '../types/index.js';
export declare class StarRocksMCPServer {
    private server;
    private connection;
    private config;
    constructor(config: StarRocksConfig);
    private setupToolHandlers;
    private handleRunSqlQuery;
    private handleCreateTable;
    private handleInsertData;
    private handleUpdateData;
    private handleDeleteData;
    private handleExecuteSql;
    initialize(): Promise<void>;
    start(): Promise<void>;
    shutdown(): Promise<void>;
}
//# sourceMappingURL=StarRocksMCPServer.d.ts.map