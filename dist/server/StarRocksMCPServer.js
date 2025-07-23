import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { StarRocksConnection } from '../connection/StarRocksConnection.js';
export class StarRocksMCPServer {
    server;
    connection;
    config;
    constructor(config) {
        this.config = config;
        this.connection = new StarRocksConnection(config);
        this.server = new Server({
            name: 'starrocks-mcp-server',
            version: '1.0.0',
        });
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        // List tools
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
        // Call tool
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
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
            }
            catch (error) {
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
    async handleRunSqlQuery(args) {
        const { query } = args;
        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }
        // Validate that it's a SELECT query
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery.startsWith('select ')) {
            throw new Error('Only SELECT queries are allowed for this tool');
        }
        const result = await this.connection.query(query);
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
    async handleCreateTable(args) {
        const { query } = args;
        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }
        const result = await this.connection.execute(query);
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
    async handleInsertData(args) {
        const { query } = args;
        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }
        const result = await this.connection.execute(query);
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
    async handleUpdateData(args) {
        const { query } = args;
        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }
        const result = await this.connection.execute(query);
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
    async handleDeleteData(args) {
        const { query } = args;
        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }
        const result = await this.connection.execute(query);
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
    async handleExecuteSql(args) {
        const { query } = args;
        if (!query || typeof query !== 'string') {
            throw new Error('Query parameter is required and must be a string');
        }
        const result = await this.connection.execute(query);
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
    async initialize() {
        try {
            await this.connection.connect();
            console.log('StarRocks MCP Server initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize StarRocks MCP Server:', error);
            throw error;
        }
    }
    async start() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.log('StarRocks MCP Server started');
    }
    async shutdown() {
        await this.connection.close();
        console.log('StarRocks MCP Server shutdown');
    }
}
//# sourceMappingURL=StarRocksMCPServer.js.map