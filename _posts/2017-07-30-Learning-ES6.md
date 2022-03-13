---
layout: post
title: ES6 demos 
tags:
- interview 
excerpt: Share some ES6 demos to understand 
---

ES6 included following new features:

## arrows

Arrows是函数的一种缩写,与普通函数的this作用域不同, 箭头函数内部与它周围代码共享this作用域. 即, this指向同一个东西 . 

    ``` javascript
    // Expression bodies 表达式函数体
    let odds = evens.map(v => v + 1);
    let nums = evens.map((v, i) => v + i);
    let pairs = evens.map(v => ({even: v, odd: v + 1})); // return obj

    // Statement bodies 块级函数体
    nums.forEach(v => {
        if (v % 5 === 0) {
            fives.push(v);
        }
    });

    // Lexical this: this 作用域
    let bob = {
        _name: "Bob",
        _friends: [],
        printFriends(){
            this._friends.forEach(f => console.log(this._name + " knows " + f));
        }
    }
    ```

##  classes
    ES6的类是基于prototype的OO模式的语法糖. 类支持基于prototype的继承, 超级调用(super calls), 实例(instance), 静态方法(static methods)以及构造函数 .


```javascript
// Classes
class SkinnedMesh extends THREE.Mesh {
    constructor(geometry, metrials) {
        super(geometry, meterials);

        this.idMatrix = SkinnedMesh.defaultMatrix();
        this.bones = [];
        this.boneMatrices = [];

        // ...
    }

    update(camera) {
        // ...

        super.update();
    }

    get boneCount() {
        return this.bones.length;
    }

    set matrixType(matrixType) {
        this.idMatrix = SkinnedMesh[matrixType]();
    }

    static defaultMatrix() {
        return new THREE.Matrix4();
    }
}
```

##    enhanced object literals
对象字面量被扩展用于支持在构建时设置prototype, foo: foo的简写, 定义方法, 超级调用(super calls)以及使用表达式计算属性名称.

```javascript
let obj = {
    // __proto__
    __proto__: theProtoObj,

    // Shorthand for `handler: handler`
    handler,

    // Methods
    toString() {
        // super calls
        return "d " + super.toString();
    },
    // Computed (dynamic) property names
    ['prop_' + (()=> 42)]: 42
}
```
##  template strings
    模板字符串(template strings)提供了一个构建字符串的语法糖. 可以添加标签(tag)以允许字符串在构建时被定制, 避免注入攻击或者从字符串内容构建更高级别的数据结构 .

    ```javascript
    // 简单字面量字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
not legal.`

// 字符串插值
let name = "Bob";
let time = "today";
`Hello ${name}, how are you ${time}?`

// 构造一个HTTP请求前缀, 用于演绎替换和构造
POST `http://foo.org/bar?a=${a}&b=${b}
      Content-type: application/json
      X-Credentials: ${credentials}
      {"foo": ${foo},
       "bar": ${bar}}`(myOnReadyStateChangeHandler);
    ```

##    destructuring
    解构允许使用模式匹配进行绑定, 支持匹配数组和对象. 解构是故障弱化(指未匹配上时, 也不会出错, 而是产生一个undefined值)

    ``` javascript
    // list匹配
let [a, , b] = [1, 2, 3];
// a=1; b=3

// object匹配
let {op: a, lhs: {op: b}, rhs: c} = getASTNode();

// object匹配简写
// 在scope内绑定`op`, `lhs`及`rhs`
let {op, lhs, rhs} = getASTNode();

// 可用于参数位置
function g({name: x}) {
    console.log(x); // 5
}
g({name: 5});

// 故障弱化解构
let [a] = [];
a === undefined;

// 故障弱化解构, 带默认值
let [a = 1]=[];
a === 1;
    ```

##   default + rest + spred
    为函数的参数设置默认值. 将传入的参数的剩余参数绑定到数组. 使用...操作符, 将数组解构成参数列表 .

    ``` javascript
    // 给参数设置默认值
function f(x, y = 12) {
    // 如果没有传入y的值(或者传入的是undefined), 那么y就等于默认的值12
    return x + y;
}
f(3) === 15

// 将传入的参数的剩余参数绑定到数组
function f(x, ...y) {
    // y是一个数组Array
    return x * y.length;
}

f(3, "hello", true) === 6;

// 使用...操作符, 将数组解构成参数列表
function f(x, y, z) {
    return x + y + z;
}
// 传入一个数组作为参数
f(...[1, 2, 3]) === 6;
    ```

    let + const
    用let和const代替var, 定义块级作用域的变量 .

    ``` javascript
    function f() {
    let x;
    {
        // 由于let定义的是块级作用域的变量, 所以这样是合法的
        const x = "sneaky";

        // 由于const定义的是常量, 所以不能再进行赋值操作
        x = "foo";
    }

    // 由于在函数f()内, 前面已经有let x的定义, 所以不能再次定义
    // 报错: Uncaught SyntaxError: Identifier 'x' has already been declared
    let x = "inner";
}
    ```

##    iterators + for..of
    迭代器对象启用自定义迭代

    ``` javascript
    let fibonacci = {
    [Symbol.iterator](){
        let pre = 0;
        let cur = 1;
        return {
            next(){
                [pre, cur] = [cur, pre + cur];
                return {done: false, value: cur}
            }
        }
    }
}

for (var n of fibonacci) {
    // 在1000处截断序列
    if (n > 1000) {
        break;
    }

    console.log(n);
}
    ```

##  genetators
    Generators使用function* 和yield简化iterator-autoring. 声明为function*的函数返回一个Generator实例. Generators是迭代器的子类型, 包括next和throw. 这些可能的值返回到generator, 因此yield是一个表达式, 它返回值或throws.

    ``` javascript
let fibonacci = {
    [Symbol.iterator]: function*() {
        let pre = 0;
        let cur = 1;
        for (; ;) {
            let temp = pre;
            pre = cur;
            cur += temp;
            
            yield cur;
        }
    }
}

for (let p of fibonacci) {
    // 在1000处截断序列
    if (p > 1000) {
        break;
    }
    console.log(p);
}
    ```


##  unicode

    ``` javascript
// same as ES5.1
"𠮷".length == 2

// new RegExp behaviour, opt-in ‘u’
"𠮷".match(/./u)[0].length == 2

// new form
"\u{20BB7}"=="𠮷"=="\uD842\uDFB7"

// new String ops
"𠮷".codePointAt(0) == 0x20BB7

// for-of iterates code points
for(var c of "𠮷") {
  console.log(c);
}
```

##  modules
语言级支持模块化组件定义. 吸收流行的JavaScript模块加载方式(AMD, CommonJS).

``` javascript
// lib/math.js
export function sum(x, y) {
    return x + y;
}
export let pi = 3.141593;

// app.js
import * as math from "lib/math";
console.log(`2π = ${math.sum(math.pi, math.pi)}`);

// otherApp.js
import {sum, pi} from "lib/math";
console.log(`2π = ${sum(pi, pi)}`);

// lib/mathPlusPlus.js
export * from "lib/math";
export let e = 2.71828182846;
export default function (x) {
    return Math.log(x);
}

// app.js
import ln, {pi, e} from "lib/mathPlusPlus";
console.log(`2π = ${ln(e) * pi * 2}`);
```
##  module loaders
    模块加载器支持:

    Dynamic loading 动态加载

    State isolation

    Global namespace isolation

    Complilation hooks

    Nested virtualization

可用配置默认模块加载器, 并且可以构造新的加载器以在隔离或约束上下文中评估和加载代码 .


``` javascript
// Dynamic loading - "System" is default loader
System.import("lib/math").then(function(m) {
    console.log(`2π = ${m.sum(m.pi, m.pi)}`);
});
```

##    map + set + weakmap + weakset

    ``` javascript
    // Sets
let s = new Set();
s.add("hello").add("goodbye").add("hello");
// s.size === 2;
// s.has("hello") === true;

// Maps
let m = new Map();
m.set("hello", 42);
m.set(s, 34);
// m.get(s) === 34;

// Weak Sets
let ws = new WeakSet();
ws.add({data: 42});

// Weak Maps
let wm = new WeakMap();
wm.set(s, {extra: 42});
// wm.size === undefined;
    ```

##  proxies
    代理可以创建具有可用于托管对象的全部行为的对象 .

    ``` javascript
    // Proxying a normal object
let target = {};
let handler = {
    get: function(receiver, name) {
        return `Hello, ${name}!`;
    }
}

let p = new Proxy(target, handler);
// p.world === `Hello, world!`;

// Proxying a function object 
let target = function() {return `I am the target`;};
let handler = {
    apply: function(receiver, ...args) {
        return `I am the proxy.`;
    }
}

let p = new Proxy(target, handler);
// p() === `I am the proxy.`;

var handler =
{
  get:...,
  set:...,
  has:...,
  deleteProperty:...,
  apply:...,
  construct:...,
  getOwnPropertyDescriptor:...,
  defineProperty:...,
  getPrototypeOf:...,
  setPrototypeOf:...,
  enumerate:...,
  ownKeys:...,
  preventExtensions:...,
  isExtensible:...
}
    ```

##  symbols
    Symbols是一种新的原始数据类型. 可选描述参数用于调试, 但不是身份的一部分. Symbols是唯一的(如gensym), 但不是私有的, 因为他们通过反射功能进行显示, 如Object.getOwnPropertySymbols.

    ``` javascript
    let MyClass = (function () {
    // module scoped symbol
    let key = Symbol("key");

    function MyClass(privateData) {
        this[key] = privateData;
    }

    MyClass.prototype = {
        doStuff: function () {
            // ...
            this[key]
            // ...
        }
    }

    return MyClass;
})();

let c = new MyClass("hello");
// c["key"] === undefined;
    ```

## promises
    Promises是一个异步编程库. Promises是一个容器, 保存着某个未来才会结束的事件(通常是一个异步操作)的结果.

    ``` javascript
    function timeout(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
}

let p = timeout(1000).then(()=> {
    return timeout(2000);
}).then(()=> {
    throw new Error("hmm");
}).catch(err=> {
    return Promise.all([timeout(100), timeout(200)]);
})
    ```

## math + number + string + array + object APIs

    新增了许多新的库, 包括核心的Math库, Array转换助手, String助手以及用于copy的Object.assign.

    ``` javascript
    Number.isInteger(Infinity); // false
Number.isNaN("NaN");  // false

Math.acosh(3); // 1.762747174039086
Math.hypot(3, 4); // 5
Math.imul(Math.pow(2, 32) - 1, Math.pow(2, 32) - 2); // 2

"abcde".includes("cd"); // true
"abc".repeat(3); // "abcabcabc"

Array.from(document.querySelectorAll("*")) // Returns a real Array
Array.of(1, 2, 3); // Similar to new Array(...), but without special one-arg behavior
[0, 0, 0].fill(7, 1); // [0, 7, 1]
[1, 2, 3].find(x => x === 3); // 3
[1, 2, 3].findIndex(x => x === 2); // 1
[1, 2, 3, 4, 5].copyWithin(3, 0); // [1, 2, 3, 1, 2]
["a", "b", "c"].entries(); // iterator [0, "a"], [1, "b"], [2, "c"]
["a", "b", "c"].keys(); // iterator 0, 1, 2
["a", "b", "c"].values(); // iterator "a", "b", "c"

Object.assign(Point, {origin: new Point(0, 0)});
    ```



