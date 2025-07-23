# StarRocks MCP Server

一个专业的 TypeScript 版本的 StarRocks MCP (Model Context Protocol) 服务器实现。

## 功能特性

- 🔌 **完整的 MCP 协议支持** - 实现了标准的 MCP 协议
- 🗄️ **StarRocks 数据库集成** - 支持 StarRocks 数据库的所有操作
- 🛠️ **多种 SQL 操作** - 支持 SELECT、INSERT、UPDATE、DELETE、CREATE TABLE 等
- 🔒 **安全性** - 内置 SQL 验证和错误处理
- 📝 **完整的日志系统** - 支持不同级别的日志记录
- 🧪 **测试覆盖** - 包含完整的单元测试
- 📦 **TypeScript 支持** - 完整的类型定义和类型安全

## 支持的 MCP 工具

| 工具名称 | 描述 | 参数 |
|---------|------|------|
| `run_sql_query` | 执行只读 SQL 查询（仅限 SELECT 语句） | `query: string` |
| `create_table` | 在 StarRocks 数据库中创建新表 | `query: string` |
| `insert_data` | 向 StarRocks 数据库表插入数据 | `query: string` |
| `update_data` | 更新 StarRocks 数据库表中的数据 | `query: string` |
| `delete_data` | 从 StarRocks 数据库表中删除数据 | `query: string` |
| `execute_sql` | 执行任意非 SELECT 的 SQL 语句 | `query: string` |

## 安装和设置

### 1. 克隆项目

```bash
git clone https://github.com/your-username/StarRocks-MCP.git
cd StarRocks-MCP
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp env.example .env
```

编辑 `.env` 文件，配置你的 StarRocks 数据库连接信息：

```env
# StarRocks Database Configuration
STARROCKS_HOST=localhost
STARROCKS_PORT=9030
STARROCKS_USER=root
STARROCKS_PASSWORD=your_password_here
STARROCKS_DATABASE=your_database_name

# Optional Configuration
STARROCKS_CHARSET=utf8mb4
STARROCKS_TIMEZONE=local
STARROCKS_CONNECTION_LIMIT=10
STARROCKS_ACQUIRE_TIMEOUT=60000
STARROCKS_TIMEOUT=60000

# Logging Configuration
NODE_ENV=production
LOG_LEVEL=info
```

### 4. 构建项目

```bash
npm run build
```

### 5. 运行服务器

```bash
npm start
```

## 开发

### 开发模式运行

```bash
npm run dev
```

### 运行测试

```bash
npm test
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 项目结构

```
src/
├── connection/          # 数据库连接管理
│   └── StarRocksConnection.ts
├── server/             # MCP 服务器核心
│   └── StarRocksMCPServer.ts
├── types/              # TypeScript 类型定义
│   └── index.ts
├── utils/              # 工具类
│   ├── ErrorHandler.ts
│   ├── Logger.ts
│   └── SqlValidator.ts
├── tests/              # 测试文件
│   ├── setup.ts
│   └── StarRocksConnection.test.ts
└── index.ts            # 主入口文件
```

## 使用示例

### 1. 查询数据

```json
{
  "method": "tools/call",
  "params": {
    "name": "run_sql_query",
    "arguments": {
      "query": "SELECT * FROM users WHERE age > 18;"
    }
  }
}
```

### 2. 创建表

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_table",
    "arguments": {
      "query": "CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100), age INT);"
    }
  }
}
```

### 3. 插入数据

```json
{
  "method": "tools/call",
  "params": {
    "name": "insert_data",
    "arguments": {
      "query": "INSERT INTO users (id, name, age) VALUES (1, 'John', 25);"
    }
  }
}
```

## 配置选项

### 数据库配置

| 配置项 | 默认值 | 描述 |
|--------|--------|------|
| `STARROCKS_HOST` | `localhost` | StarRocks 服务器主机 |
| `STARROCKS_PORT` | `9030` | StarRocks 服务器端口 |
| `STARROCKS_USER` | `root` | 数据库用户名 |
| `STARROCKS_PASSWORD` | `''` | 数据库密码 |
| `STARROCKS_DATABASE` | `undefined` | 默认数据库名 |
| `STARROCKS_CHARSET` | `utf8mb4` | 字符集 |
| `STARROCKS_TIMEZONE` | `local` | 时区 |

### 连接配置

| 配置项 | 默认值 | 描述 |
|--------|--------|------|
| `STARROCKS_CONNECTION_LIMIT` | `10` | 连接池大小 |
| `STARROCKS_ACQUIRE_TIMEOUT` | `60000` | 获取连接超时时间（毫秒） |
| `STARROCKS_TIMEOUT` | `60000` | 查询超时时间（毫秒） |

### 日志配置

| 配置项 | 默认值 | 描述 |
|--------|--------|------|
| `LOG_LEVEL` | `info` | 日志级别（debug, info, warn, error） |
| `NODE_ENV` | `production` | 运行环境 |

## 错误处理

服务器包含完整的错误处理机制：

- **连接错误** - 自动重连和错误恢复
- **SQL 错误** - 详细的错误信息和建议
- **MCP 协议错误** - 标准化的错误响应
- **日志记录** - 完整的错误日志记录

## 安全性

- ✅ SQL 注入防护
- ✅ 参数化查询
- ✅ 输入验证
- ✅ 错误信息过滤
- ✅ 连接池管理

## 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 支持

如果你遇到问题或有建议，请：

1. 查看 [Issues](../../issues)
2. 创建新的 Issue
3. 联系维护团队

---

**StarRocks MCP Server** - 让 StarRocks 数据库操作更简单、更安全！
