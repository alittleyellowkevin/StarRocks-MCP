import mysql from 'mysql2/promise';
import { StarRocksConfig } from '../interface/types.js';

export class StarRocksConnection {
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

    // 获取原始连接对象，供其他模块使用
    getConnection(): mysql.Connection | null {
        return this.connection;
    }

    // 检查连接状态
    isConnectionEstablished(): boolean {
        return this.connection !== null;
    }
} 