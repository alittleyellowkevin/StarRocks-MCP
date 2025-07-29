export class SqlValidator {
    /**
     * 验证SQL语句是否为SELECT查询
     */
    static isSelectQuery(sql: string): boolean {
        const trimmedSql = sql.trim().toLowerCase();
        return trimmedSql.startsWith('select ');
    }

    /**
     * 验证SQL语句是否为CREATE TABLE语句
     */
    static isCreateTableQuery(sql: string): boolean {
        const trimmedSql = sql.trim().toLowerCase();
        return trimmedSql.startsWith('create table ');
    }

    /**
     * 验证SQL语句是否为INSERT语句
     */
    static isInsertQuery(sql: string): boolean {
        const trimmedSql = sql.trim().toLowerCase();
        return trimmedSql.startsWith('insert ');
    }

    /**
     * 验证SQL语句是否为UPDATE语句
     */
    static isUpdateQuery(sql: string): boolean {
        const trimmedSql = sql.trim().toLowerCase();
        return trimmedSql.startsWith('update ');
    }

    /**
     * 验证SQL语句是否为DELETE语句
     */
    static isDeleteQuery(sql: string): boolean {
        const trimmedSql = sql.trim().toLowerCase();
        return trimmedSql.startsWith('delete ');
    }

    /**
     * 验证SQL语句是否为DDL语句（CREATE, ALTER, DROP等）
     */
    static isDdlQuery(sql: string): boolean {
        const trimmedSql = sql.trim().toLowerCase();
        return (
            trimmedSql.startsWith('create ') ||
            trimmedSql.startsWith('alter ') ||
            trimmedSql.startsWith('drop ') ||
            trimmedSql.startsWith('truncate ')
        );
    }

    /**
     * 检查SQL语句是否包含危险操作
     */
    static hasDangerousOperations(sql: string): boolean {
        const dangerousKeywords = [
            'drop database',
            'drop table',
            'truncate table',
            'delete from',
            'update ',
            'alter table',
            'create table',
            'create database',
        ];

        const lowerSql = sql.toLowerCase();
        return dangerousKeywords.some(keyword => lowerSql.includes(keyword));
    }

    /**
     * 获取SQL语句的类型
     */
    static getSqlType(sql: string): 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'ALTER' | 'DROP' | 'OTHER' {
        const trimmedSql = sql.trim().toLowerCase();

        if (trimmedSql.startsWith('select ')) return 'SELECT';
        if (trimmedSql.startsWith('insert ')) return 'INSERT';
        if (trimmedSql.startsWith('update ')) return 'UPDATE';
        if (trimmedSql.startsWith('delete ')) return 'DELETE';
        if (trimmedSql.startsWith('create ')) return 'CREATE';
        if (trimmedSql.startsWith('alter ')) return 'ALTER';
        if (trimmedSql.startsWith('drop ')) return 'DROP';

        return 'OTHER';
    }

    /**
     * 验证SQL语句的基本语法
     */
    static validateBasicSyntax(sql: string): { isValid: boolean; error?: string } {
        const trimmedSql = sql.trim();

        if (!trimmedSql) {
            return { isValid: false, error: 'SQL statement cannot be empty' };
        }

        if (!trimmedSql.endsWith(';')) {
            return { isValid: false, error: 'SQL statement must end with semicolon' };
        }

        // 检查是否包含基本的SQL关键字
        const sqlKeywords = ['select', 'insert', 'update', 'delete', 'create', 'alter', 'drop', 'from', 'where', 'into', 'values', 'set'];
        const hasKeyword = sqlKeywords.some(keyword =>
            trimmedSql.toLowerCase().includes(keyword)
        );

        if (!hasKeyword) {
            return { isValid: false, error: 'SQL statement must contain valid SQL keywords' };
        }

        return { isValid: true };
    }
} 