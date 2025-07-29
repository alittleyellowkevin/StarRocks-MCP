import { spawn } from 'child_process';

// 测试StarRocks MCP服务器
async function testMCPServer() {
    console.log('启动StarRocks MCP服务器进行测试...');

    // 启动MCP服务器进程
    const serverProcess = spawn('node', ['dist/index.js'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
            ...process.env,
            STARROCKS_HOST: '10.9.103.231',
            STARROCKS_PORT: '9030',
            STARROCKS_USER: 'test',
            STARROCKS_PASSWORD: 'test.123456',
            STARROCKS_DATABASE: 'test'
        }
    });

    // 监听服务器输出
    serverProcess.stderr.on('data', (data) => {
        console.log('服务器日志:', data.toString());
    });

    serverProcess.stdout.on('data', (data) => {
        console.log('服务器输出:', data.toString());
    });

    // 等待服务器启动
    console.log('等待服务器启动...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 测试1: 列出可用工具
    console.log('\n=== 测试1: 列出可用工具 ===');
    const listToolsRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
    };

    console.log('发送工具列表请求:', JSON.stringify(listToolsRequest, null, 2));
    serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');

    // 等待响应
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 测试2: 执行SQL查询
    console.log('\n=== 测试2: 执行SQL查询 ===');
    const sqlQueryRequest = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
            name: 'run_sql_query',
            arguments: {
                query: 'SELECT 1 as test_value, NOW() as current_datetime'
            }
        }
    };

    console.log('发送SQL查询请求:', JSON.stringify(sqlQueryRequest, null, 2));
    serverProcess.stdin.write(JSON.stringify(sqlQueryRequest) + '\n');

    // 等待响应
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 测试3: 创建表
    console.log('\n=== 测试3: 创建表 ===');
    const createTableRequest = {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
            name: 'create_table',
            arguments: {
                query: `CREATE TABLE test_products (
                    id INT,
                    name VARCHAR(100) NOT NULL,
                    price DECIMAL(10,2),
                    category VARCHAR(50),
                    created_at DATETIME
                )
                ENGINE=OLAP
                PRIMARY KEY(id)
                DISTRIBUTED BY HASH(id) BUCKETS 10
                PROPERTIES (
                    "replication_num" = "1"
                )`
            }
        }
    };

    console.log('发送创建表请求:', JSON.stringify(createTableRequest, null, 2));
    serverProcess.stdin.write(JSON.stringify(createTableRequest) + '\n');

    // 等待响应
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 测试4: 插入数据
    console.log('\n=== 测试4: 插入数据 ===');
    const insertDataRequest = {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
            name: 'insert_data',
            arguments: {
                query: `INSERT INTO test_products (id, name, price, category, created_at) VALUES 
                (1, 'Laptop', 999.99, 'Electronics', NOW()),
                (2, 'Mouse', 29.99, 'Electronics', NOW()),
                (3, 'Keyboard', 89.99, 'Electronics', NOW())`
            }
        }
    };

    console.log('发送插入数据请求:', JSON.stringify(insertDataRequest, null, 2));
    serverProcess.stdin.write(JSON.stringify(insertDataRequest) + '\n');

    // 等待响应
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 测试5: 查询数据
    console.log('\n=== 测试5: 查询数据 ===');
    const selectDataRequest = {
        jsonrpc: '2.0',
        id: 5,
        method: 'tools/call',
        params: {
            name: 'run_sql_query',
            arguments: {
                query: 'SELECT * FROM test_products ORDER BY id'
            }
        }
    };

    console.log('发送查询数据请求:', JSON.stringify(selectDataRequest, null, 2));
    serverProcess.stdin.write(JSON.stringify(selectDataRequest) + '\n');

    // 等待响应
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 关闭服务器
    console.log('\n=== 测试完成，关闭服务器 ===');
    serverProcess.kill('SIGTERM');

    // 等待进程完全关闭
    await new Promise(resolve => {
        serverProcess.on('close', (code) => {
            console.log(`服务器进程已关闭，退出码: ${code}`);
            resolve();
        });
    });
}

// 运行测试
testMCPServer().catch(console.error); 