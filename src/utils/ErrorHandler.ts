export class ErrorHandler {
    /**
     * 处理数据库连接错误
     */
    static handleConnectionError(error: any): string {
        if (error.code === 'ECONNREFUSED') {
            return '无法连接到StarRocks数据库，请检查主机和端口配置';
        }

        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            return '数据库访问被拒绝，请检查用户名和密码';
        }

        if (error.code === 'ER_BAD_DB_ERROR') {
            return '数据库不存在，请检查数据库名称';
        }

        return `数据库连接错误: ${error.message}`;
    }

    /**
     * 处理SQL执行错误
     */
    static handleSqlError(error: any): string {
        if (error.code === 'ER_PARSE_ERROR') {
            return `SQL语法错误: ${error.message}`;
        }

        if (error.code === 'ER_NO_SUCH_TABLE') {
            return '表不存在，请检查表名';
        }

        if (error.code === 'ER_NO_SUCH_COLUMN') {
            return '列不存在，请检查列名';
        }

        if (error.code === 'ER_DUP_ENTRY') {
            return '重复条目，违反了唯一性约束';
        }

        if (error.code === 'ER_DATA_TOO_LONG') {
            return '数据长度超出限制';
        }

        if (error.code === 'ER_WRONG_VALUE_COUNT') {
            return '列数与值数不匹配';
        }

        return `SQL执行错误: ${error.message}`;
    }

    /**
     * 处理MCP协议错误
     */
    static handleMCPError(error: any): string {
        if (error.code === 'INVALID_REQUEST') {
            return '无效的MCP请求格式';
        }

        if (error.code === 'METHOD_NOT_FOUND') {
            return '请求的方法不存在';
        }

        if (error.code === 'INVALID_PARAMS') {
            return '请求参数无效';
        }

        return `MCP协议错误: ${error.message}`;
    }

    /**
     * 创建标准化的错误响应
     */
    static createErrorResponse(code: number, message: string, data?: any) {
        return {
            jsonrpc: '2.0' as const,
            error: {
                code,
                message,
                data,
            },
        };
    }

    /**
     * 创建标准化的成功响应
     */
    static createSuccessResponse(id: string | number, result: any) {
        return {
            jsonrpc: '2.0' as const,
            id,
            result,
        };
    }

    /**
     * 记录错误日志
     */
    static logError(context: string, error: any): void {
        const timestamp = new Date().toISOString();
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stackTrace = error instanceof Error ? error.stack : undefined;

        console.error(`[${timestamp}] ${context}:`, {
            message: errorMessage,
            stack: stackTrace,
            code: error.code,
        });
    }
} 