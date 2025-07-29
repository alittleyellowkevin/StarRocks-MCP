import { QueryResult } from '../interface/types.js';
import { StarRocksConnection } from '../connection/StarRocksConnection.js';

export class SqlExecutor {
    private connection: StarRocksConnection;

    constructor(connection: StarRocksConnection) {
        this.connection = connection;
    }

    async query(sql: string, params?: any[]): Promise<QueryResult> {
        const dbConnection = this.connection.getConnection();
        if (!dbConnection) {
            throw new Error('Database connection not established');
        }

        try {
            // 使用原始查询，不使用预处理语句
            const [rows, fields] = await dbConnection.query(sql);

            return {
                success: true,
                data: rows as any[],
                columns: fields?.map((field: any) => field.name) || [],
            };
        } catch (error) {
            console.error('Query execution failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    async execute(sql: string, params?: any[]): Promise<QueryResult> {
        const dbConnection = this.connection.getConnection();
        if (!dbConnection) {
            throw new Error('Database connection not established');
        }

        try {
            // 使用原始查询，不使用预处理语句
            const [result] = await dbConnection.query(sql);

            return {
                success: true,
                affectedRows: (result as any).affectedRows,
                insertId: (result as any).insertId,
                message: (result as any).message,
            };
        } catch (error) {
            console.error('Execute failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    async beginTransaction(): Promise<void> {
        const dbConnection = this.connection.getConnection();
        if (!dbConnection) {
            throw new Error('Database connection not established');
        }
        await dbConnection.beginTransaction();
    }

    async commit(): Promise<void> {
        const dbConnection = this.connection.getConnection();
        if (!dbConnection) {
            throw new Error('Database connection not established');
        }
        await dbConnection.commit();
    }

    async rollback(): Promise<void> {
        const dbConnection = this.connection.getConnection();
        if (!dbConnection) {
            throw new Error('Database connection not established');
        }
        await dbConnection.rollback();
    }
} 