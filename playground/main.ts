// 使用 ES2015+ 语法来演示语法检查功能

// 箭头函数 (ES2015)
const greet = (name: string) => `Hello, ${name}!`;

// 模板字符串 (ES2015)
const message = `Welcome to syntax checking demo!`;

// const/let (ES2015)
const numbers = [1, 2, 3, 4, 5];

// 解构赋值 (ES2015)
const [first, ...rest] = numbers;

// 展开运算符 (ES2015)
const moreNumbers = [...numbers, 6, 7, 8];

// 默认参数 (ES2015)
function add(a: number, b: number = 0) {
  return a + b;
}

// async/await (ES2017)
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// 可选链 (ES2020)
const user = {
  profile: {
    name: 'John'
  }
};
const userName = user?.profile?.name;

// 空值合并 (ES2020)
const defaultName = userName ?? 'Anonymous';

// 类 (ES2015)
class Calculator {
  private result: number = 0;

  // 私有字段 (ES2022)
  #history: number[] = [];

  add(value: number) {
    this.result += value;
    this.#history.push(this.result);
    return this;
  }

  getResult() {
    return this.result;
  }
}

// 使用示例
const calc = new Calculator();
calc.add(5).add(3);

console.log(greet('World'));
console.log(message);
console.log('First number:', first);
console.log('Calculator result:', calc.getResult());
console.log('User name:', defaultName);

// 导出一些内容
export { greet, Calculator };
export default message;
