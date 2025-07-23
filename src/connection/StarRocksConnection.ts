import mysql from 'mysql2/promise';
import { StarRocksConfig, StarRocksConnection as IStarRocksConnection, QueryResult } from '../types/index.js';

export class StarRocksConnection implements IStarRocksConnection {
    private connection: mysql.Connection | null = null;
    private config: StarRocksConfig;

    constructor(config: StarRocksConfig) {
        this.config = config;
    }

    async connect(): Promise<void> {
        try {
            this.connection = await mysql.createConnection({
                host: this.config.host,
                port: this.config.port,
                user: this.config.user,
                password: this.config.password,
                database: this.config.database,
                charset: this.config.charset || 'utf8mb4',
                timezone: this.config.timezone || 'local',
                connectTimeout: this.config.acquireTimeout || 60000,
                multipleStatements: true,
            });

            console.log('Successfully connected to StarRocks database');
        } catch (error) {
            console.error('Failed to connect to StarRocks database:', error);
            throw error;
        }
    }

    async query(sql: string, params?: any[]): Promise<QueryResult> {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }

        try {
            // 使用原始查询，不使用预处理语句
            const [rows, fields] = await this.connection.query(sql);

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
        if (!this.connection) {
            throw new Error('Database connection not established');
        }

        try {
            // 使用原始查询，不使用预处理语句
            const [result] = await this.connection.query(sql);

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
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        await this.connection.beginTransaction();
    }

    async commit(): Promise<void> {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        await this.connection.commit();
    }

    async rollback(): Promise<void> {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        await this.connection.rollback();
    }

    async close(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
            console.log('Database connection closed');
        }
    }

    async ping(): Promise<boolean> {
        if (!this.connection) {
            return false;
        }

        try {
            await this.connection.ping();
            return true;
        } catch (error) {
            console.error('Ping failed:', error);
            return false;
        }
    }

    async isConnected(): Promise<boolean> {
        return this.ping();
    }
} 