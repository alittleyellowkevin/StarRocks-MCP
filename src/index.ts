import dotenv from 'dotenv';
import { StarRocksMCPServer } from './server/StarRocksMCPServer.js';
import { StarRocksConfig } from './interface/types.js';

// 加载环境变量
dotenv.config();

async function main() {
    try {
        // 从环境变量中读取数据库配置
        const config: StarRocksConfig = {
            host: process.env.STARROCKS_HOST || '10.9.103.231',
            port: parseInt(process.env.STARROCKS_PORT || '9030'),
            user: process.env.STARROCKS_USER || 'test',
            password: process.env.STARROCKS_PASSWORD || 'test.123456',
            database: process.env.STARROCKS_DATABASE || 'test',
            charset: process.env.STARROCKS_CHARSET || 'utf8mb4',
            timezone: process.env.STARROCKS_TIMEZONE || 'local',
            connectionLimit: parseInt(process.env.STARROCKS_CONNECTION_LIMIT || '10'),
            acquireTimeout: parseInt(process.env.STARROCKS_ACQUIRE_TIMEOUT || '60000'),
            timeout: parseInt(process.env.STARROCKS_TIMEOUT || '60000'),
        };

        // 启动服务前输出配置信息
        console.log('Starting StarRocks MCP Server...');
        console.log('Configuration:', {
            host: config.host,
            port: config.port,
            user: config.user,
            database: config.database,
        });

        // 创建并初始化 StarRocks MCP Server
        const server = new StarRocksMCPServer(config);
        await server.initialize();
        await server.start();

        // 优雅关闭处理，监听 SIGINT 信号（如 Ctrl+C）
        process.on('SIGINT', async () => {
            console.log('\nReceived SIGINT, shutting down gracefully...');
            await server.shutdown();
            process.exit(0);
        });

        // 优雅关闭处理，监听 SIGTERM 信号
        process.on('SIGTERM', async () => {
            console.log('\nReceived SIGTERM, shutting down gracefully...');
            await server.shutdown();
            process.exit(0);
        });

        // 服务启动成功提示
        console.log('StarRocks MCP Server is running...');
    } catch (error) {
        // 启动失败时输出错误信息并退出
        console.error('Failed to start StarRocks MCP Server:', error);
        process.exit(1);
    }
}

// 捕获未处理的异常，防止进程崩溃
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// 捕获未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// 启动主函数
main().catch((error) => {
    console.error('Main function error:', error);
    process.exit(1);
});