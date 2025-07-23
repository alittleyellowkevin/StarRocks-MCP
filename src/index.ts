import dotenv from 'dotenv';
import { StarRocksMCPServer } from './server/StarRocksMCPServer.js';
import { StarRocksConfig } from './types/index.js';

// Load environment variables
dotenv.config();

async function main() {
    try {
        // Configuration from environment variables
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

        console.log('Starting StarRocks MCP Server...');
        console.log('Configuration:', {
            host: config.host,
            port: config.port,
            user: config.user,
            database: config.database,
        });

        // Create and initialize server
        const server = new StarRocksMCPServer(config);
        await server.initialize();
        await server.start();

        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\nReceived SIGINT, shutting down gracefully...');
            await server.shutdown();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log('\nReceived SIGTERM, shutting down gracefully...');
            await server.shutdown();
            process.exit(0);
        });

        console.log('StarRocks MCP Server is running...');
    } catch (error) {
        console.error('Failed to start StarRocks MCP Server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

main().catch((error) => {
    console.error('Main function error:', error);
    process.exit(1);
});