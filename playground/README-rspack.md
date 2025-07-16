# Rspack 测试工程

这个目录包含了用于测试 `unplugin-check-syntax` 在 Rspack 中工作的示例代码。

## 文件说明

- `rspack.config.js` - Rspack 配置文件，配置了 unplugin-check-syntax 插件
- `rspack-test.ts` - 包含各种现代 JavaScript 语法的测试文件
- `main.ts` - 主要的应用程序入口文件

## 如何测试

### 1. 安装依赖

```bash
# 在项目根目录
pnpm install

# 在 playground 目录
cd playground
pnpm install
```

### 2. 运行 Rspack 构建测试

```bash
# 在 playground 目录中运行
npm run test:rspack
```

### 3. 预期结果

当运行测试时，你应该会看到 `unplugin-check-syntax` 检测到的语法兼容性问题：

- **ES2017 语法错误**：`async/await` 语法
- **ES2018 语法错误**：对象展开语法 (`...`)  
- **ES2020 语法错误**：可选链操作符 (`?.`) 和空值合并操作符 (`??`)

这些语法在 ES2015 中不被支持，所以会被标记为错误。

### 4. 修改配置测试

你可以修改 `rspack.config.js` 中的 `ecmaVersion` 设置来测试不同的兼容性级别：

```javascript
UnpluginCheckSyntax({
  ecmaVersion: 2020, // 改为 ES2020 将减少报告的错误
  excludeErrorLogs: [], // 可以排除特定的错误类型
}),
```

## 配置选项

- `ecmaVersion`: 设置要检查的最低 ECMAScript 版本
- `exclude`: 排除特定文件不进行检查
- `excludeOutput`: 根据输出路径排除文件
- `excludeErrorLogs`: 排除特定类型的错误日志

## 故障排除

如果遇到问题：

1. 确保已经构建了主项目：`npm run build`
2. 确保安装了所有依赖
3. 检查 Rspack 版本兼容性
4. 查看控制台输出的详细错误信息 