import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { StarRocksConnection } from '../connection/StarRocksConnection.js';
import { SqlExecutor } from '../tools/SqlExecutor.js';
import { SqlValidator } from '../utils/SqlValidator.js';
import { StarRocksConfig } from '../interface/types.js';

// StarRocksMCPServer 类，负责管理 StarRocks MCP 服务
export class StarRocksMCPServer {
    private server: Server; // MCP 协议服务端实例
    private connection: StarRocksConnection; // StarRocks 数据库连接实例
    private executor: SqlExecutor; // SQL 执行器
    private config: StarRocksConfig; // 数据库配置

    // 构造函数，初始化配置、连接、执行器和 MCP 服务端
    constructor(config: StarRocksConfig) {
        this.config = config;
        this.connection = new StarRocksConnection(config);
        this.executor = new SqlExecutor(this.connection);

        this.server = new Server(
            {
                name: 'starrocks-mcp-server',
                version: '1.0.0',
            }
        );

        this.setupToolHandlers(); // 设置工具处理器
    }

    // 注册 MCP 工具的处理器，包括工具列表和工具调用
    private setupToolHandlers(): void {
        // 工具列表请求处理器
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'run_sql_query',
                        description: '执行只读 SQL 查询（仅限 SELECT 语句）',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: '要执行的 SQL SELECT 查询语句',
                                },
                            },
                            required: ['query'],
                        },
                    },
                    {
                        name: 'create_table',
                        description: '在 StarRocks 数据库中创建新表',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: '要执行的 SQL CREATE TABLE 语句',
                                },
                            },
                            required: ['query'],
                        },
                    },
                    {
                        name: 'insert_data',
                        description: '向 StarRocks 数据库表插入数据',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: '要执行的 SQL INSERT INTO 语句',
                                },
                            },
                            required: ['query'],
                        },
                    },
                    {
                        name: 'update_data',
                        description: '更新 StarRocks 数据库表中的数据',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: '要执行的 SQL UPDATE 语句',
                                },
                            },
                            required: ['query'],
                        },
                    },
                    {
                        name: 'delete_data',
                        description: '从 StarRocks 数据库表中删除数据',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: '要执行的 SQL DELETE FROM 语句',
                                },
                            },
                            required: ['query'],
                        },
                    },
                    {
                        name: 'execute_sql',
                        description: '执行任意非 SELECT 的 SQL 语句（如 ALTER TABLE、DROP 等）',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: '要执行的 SQL 语句',
                                },
                            },
                            required: ['query'],
                        },
                    },
                ],
            };
        });

        // 工具调用请求处理器
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                // 根据工具名称分发到不同的处理函数
                switch (name) {
                    case 'run_sql_query':
                        return await this.handleRunSqlQuery(args);
                    case 'create_table':
                        return await this.handleCreateTable(args);
                    case 'insert_data':
                        return await this.handleInsertData(args);
                    case 'update_data':
                        return await this.handleUpdateData(args);
                    case 'delete_data':
                        return await this.handleDeleteData(args);
                    case 'execute_sql':
                        return await this.handleExecuteSql(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                // 工具执行出错时返回错误信息
                console.error(`Error executing tool ${name}:`, error);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        },
                    ],
                };
            }
        });
    }

    // 处理只读 SQL 查询（SELECT）
    private async handleRunSqlQuery(args: any): Promise<any> {
        const { query } = args;

        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }

        // 校验是否为 SELECT 查询
        if (!SqlValidator.isSelectQuery(query)) {
            throw new Error('Only SELECT queries are allowed for this tool');
        }

        const result = await this.executor.query(query);

        if (!result.success) {
            throw new Error(result.error || 'Query execution failed');
        }

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }

    // 处理建表操作
    private async handleCreateTable(args: any): Promise<any> {
        const { query } = args;

        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }

        const result = await this.executor.execute(query);

        if (!result.success) {
            throw new Error(result.error || 'Table creation failed');
        }

        return {
            content: [
                {
                    type: 'text',
                    text: `Table created successfully. ${result.message || ''}`,
                },
            ],
        };
    }

    // 处理插入数据操作
    private async handleInsertData(args: any): Promise<any> {
        const { query } = args;

        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }

        const result = await this.executor.execute(query);

        if (!result.success) {
            throw new Error(result.error || 'Data insertion failed');
        }

        return {
            content: [
                {
                    type: 'text',
                    text: `Data inserted successfully. Affected rows: ${result.affectedRows}`,
                },
            ],
        };
    }

    // 处理更新数据操作
    private async handleUpdateData(args: any): Promise<any> {
        const { query } = args;

        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }

        const result = await this.executor.execute(query);

        if (!result.success) {
            throw new Error(result.error || 'Data update failed');
        }

        return {
            content: [
                {
                    type: 'text',
                    text: `Data updated successfully. Affected rows: ${result.affectedRows}`,
                },
            ],
        };
    }

    // 处理删除数据操作
    private async handleDeleteData(args: any): Promise<any> {
        const { query } = args;

        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }

        const result = await this.executor.execute(query);

        if (!result.success) {
            throw new Error(result.error || 'Data deletion failed');
        }

        return {
            content: [
                {
                    type: 'text',
                    text: `Data deleted successfully. Affected rows: ${result.affectedRows}`,
                },
            ],
        };
    }

    // 处理任意非 SELECT 的 SQL 执行
    private async handleExecuteSql(args: any): Promise<any> {
        const { query } = args;

        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }

        const result = await this.executor.execute(query);

        if (!result.success) {
            throw new Error(result.error || 'SQL execution failed');
        }

        return {
            content: [
                {
                    type: 'text',
                    text: `SQL executed successfully. ${result.message || ''}`,
                },
            ],
        };
    }

    // 初始化数据库连接
    async initialize(): Promise<void> {
        try {
            await this.connection.connect();
            console.log('StarRocks MCP Server initialized successfully');
        } catch (error) {
            console.error('Failed to initialize StarRocks MCP Server:', error);
            throw error;
        }
    }

    // 启动 MCP 服务，监听 stdio
    async start(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.log('StarRocks MCP Server started');
    }

    // 关闭数据库连接，优雅关闭服务
    async shutdown(): Promise<void> {
        await this.connection.close();
        console.log('StarRocks MCP Server shutdown');
    }
}