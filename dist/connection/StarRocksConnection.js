import mysql from 'mysql2/promise';
export class StarRocksConnection {
    connection = null;
    config;
    constructor(config) {
        this.config = config;
    }
    async connect() {
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
        }
        catch (error) {
            console.error('Failed to connect to StarRocks database:', error);
            throw error;
        }
    }
    async query(sql, params) {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        try {
            // 使用原始查询，不使用预处理语句
            const [rows, fields] = await this.connection.query(sql);
            return {
                success: true,
                data: rows,
                columns: fields?.map((field) => field.name) || [],
            };
        }
        catch (error) {
            console.error('Query execution failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }
    async execute(sql, params) {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        try {
            // 使用原始查询，不使用预处理语句
            const [result] = await this.connection.query(sql);
            return {
                success: true,
                affectedRows: result.affectedRows,
                insertId: result.insertId,
                message: result.message,
            };
        }
        catch (error) {
            console.error('Execute failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }
    async beginTransaction() {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        await this.connection.beginTransaction();
    }
    async commit() {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        await this.connection.commit();
    }
    async rollback() {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        await this.connection.rollback();
    }
    async close() {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
            console.log('Database connection closed');
        }
    }
    async ping() {
        if (!this.connection) {
            return false;
        }
        try {
            await this.connection.ping();
            return true;
        }
        catch (error) {
            console.error('Ping failed:', error);
            return false;
        }
    }
    async isConnected() {
        return this.ping();
    }
}
//# sourceMappingURL=StarRocksConnection.js.map