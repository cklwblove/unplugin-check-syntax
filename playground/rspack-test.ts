// 这个文件包含一些现代JavaScript语法，用于测试rspack语法检查功能

// ES2017 async/await (会被检测为不兼容ES2015)
async function fetchData(url: string) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// ES2018 rest/spread properties (会被检测为不兼容ES2015)
const user = {
  name: 'John',
  age: 30,
  city: 'New York'
};

const updatedUser = {
  ...user,
  age: 31
};

// ES2020 optional chaining (会被检测为不兼容ES2015)
const getUserName = (user: any) => {
  return user?.profile?.name ?? 'Unknown';
};

// ES2020 nullish coalescing (会被检测为不兼容ES2015)
const getDefaultValue = (value: any) => {
  return value ?? 'default';
};

// ES2015 arrow functions (应该兼容)
const multiply = (a: number, b: number) => a * b;

// ES2015 template literals (应该兼容)
const greeting = (name: string) => `Hello, ${name}!`;

// ES2015 const/let (应该兼容)
const PI = 3.14159;
let counter = 0;

// ES2015 destructuring (应该兼容)
const [first, second] = [1, 2];
const { name, age } = user;

// 导出函数供测试使用
export {
  fetchData,
  updatedUser,
  getUserName,
  getDefaultValue,
  multiply,
  greeting,
  PI,
  counter,
  first,
  second,
  name,
  age
}; 