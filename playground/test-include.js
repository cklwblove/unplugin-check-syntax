// 这个文件用于测试 include 功能
// 包含一些 ES2020+ 的语法，应该被检测出来

// Optional chaining (ES2020)
const user = { name: 'test' };
const result = user?.profile?.avatar;

// Nullish coalescing (ES2020)
const config = {
  theme: null,
  timeout: 0
};
const theme = config.theme ?? 'dark';
const timeout = config.timeout ?? 5000;

// BigInt (ES2020)
const bigNumber = 123456789012345678901234567890n;

// Dynamic import (ES2020)
async function loadModule() {
  const module = await import('./main.ts');
  return module.default;
}

console.log('Include test file loaded'); 