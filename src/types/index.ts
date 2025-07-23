export interface StarRocksConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database?: string;
    charset?: string;
    timezone?: string;
    connectionLimit?: number;
    acquireTimeout?: number;
    timeout?: number;
}

export interface QueryResult {
    success: boolean;
    data?: any[];
    columns?: string[];
    error?: string;
    affectedRows?: number;
    insertId?: number;
    message?: string;
}

export interface TableInfo {
    name: string;
    type: 'BASE TABLE' | 'VIEW';
    engine?: string;
    comment?: string;
    collation?: string;
    rows?: number;
    avgRowLength?: number;
    dataLength?: number;
    maxDataLength?: number;
    indexLength?: number;
    dataFree?: number;
    autoIncrement?: number;
    createTime?: string;
    updateTime?: string;
    checkTime?: string;
    checksum?: number;
    createOptions?: string;
    tableComment?: string;
}

export interface ColumnInfo {
    field: string;
    type: string;
    null: 'YES' | 'NO';
    key: string;
    default: any;
    extra: string;
    privileges: string;
    comment: string;
}

export interface DatabaseInfo {
    name: string;
    collation?: string;
    characterSet?: string;
}

export interface MCPRequest {
    jsonrpc: '2.0';
    id: string | number;
    method: string;
    params?: any;
}

export interface MCPResponse {
    jsonrpc: '2.0';
    id: string | number;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

export interface StarRocksConnection {
    query(sql: string, params?: any[]): Promise<QueryResult>;
    execute(sql: string, params?: any[]): Promise<QueryResult>;
    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    close(): Promise<void>;
    ping(): Promise<boolean>;
}

export interface StarRocksServer {
    initialize(): Promise<void>;
    handleRequest(request: MCPRequest): Promise<MCPResponse>;
    shutdown(): Promise<void>;
} 