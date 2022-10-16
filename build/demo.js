"use strict";
/*
官方文档：https://www.typescriptlang.org/docs/handbook/2/basic-types.html
*/
/*************************基础类型快速入门***************************** */
let lala = 'sun';
lala = 'ii';
// 数组
const arr = [9, 8];
const arrDemo = ['99', 'kk'];
const arrdemoOne = ['fdf', 9];
const arrdemoTwo = [{ name: 'aaa', age: 999 }];
// 元组tuple
const arrtuple = ['liming', 'boy', 19];
// 参数类型，函数类型
const showMessage = (age) => age;
// 函数类型整体定义
const show = (message) => 'lalalal';
const xiaoming = { age: 12, sex: 'boy' };
const liming = { age: 12, sex: 'boy', name: 'liming' };
;
const circleColor = { radius: 333, color: 'red' };
const xiaomingtype = { age: 34 };
const liming01 = { age: 23, sex: 'boy', name: 'liming' };
// 断言作用及写法 assersion
const dom = document.getElementById('#root');
const dom01 = document.getElementById('#root');
const dom02 = document.getElementById('#root');
//字面量类型：更加精确限制
const request = (url, method) => {
    return {
        data: 'lalal'
    };
};
const params = {
    url: 'baidu.com',
    method: 'GET'
};
// method类型不一致，传入的是string类型，定义的是字面量类型'GET' | 'POST', 即string类型和字面量类型不是一回事
// const params: {url: string, method: 'GET' | 'POST'} = {
//     url: 'baidu.com',
//     method: 'GET'
// };
// 或者
// request(params.url, params.method as 'GET');
request(params.url, params.method);
// null、undefined类型（相互可以容错, 可以配置对null的严格检查：strickNullChecks: true）
const testNullType = undefined;
const testUndefinedType = null;
// void 类型：定义函数返回为空
const demofunc = () => { };
/*************************类型注解和类型推断***************************** */
// 1、类型注解： 主动添加声明的类型
// 2、类型推断：根据定义内容或者已有类型，进行推断
// 如果可以自动推断出类型，就没必要手动去写注解啦
const getTotal = (paramsOne, paramTwo) => paramsOne + paramTwo;
// 3、解构形式的类型注解
const demoOne = ({ a, b }) => a + b;
demoOne({ a: 1, b: 2 });
const demoTwo = ({ a, b }) => a + b;
demoTwo({ a: 3, b: 'f' });
;
const fnFunction = (param) => console.log(param);
// greeter函数会根据传入fn函数的执行结果，来推断greeter函数的返回类型
const greeter = (fn) => {
    return fn('mao');
};
greeter(fnFunction);
const testdemo = (str) => console.log(str);
testdemo.attr = 'attributes';
const constructorDemo = (ctor) => {
    return new ctor('lala');
};
class ctorCl {
    constructor(str) {
        this.name = str;
    }
}
constructorDemo(ctorCl);
const sun = {
    name: 'lalal',
    age: 44
};
sun.name = 'lll';
const zhao = {
    name: 'alala',
    age: 44
};
;
const getPerson = (person) => {
    console.log(person.name);
};
const personParam = {
    name: 'lalal',
    sex: 'boy'
};
// 字面量的形式：只要其中有接口声明的类型即可，可以多处一部分属性，也不会提示报错
getPerson(personParam);
getPerson({
    name: 'xiaohai',
    sex: 'girl' // 回进行强校验，字段类型必须都能匹配上
});
;
// 类中需要有接口中声明的必须数据
class PersonDemoThird {
    constructor() {
        this.name = 'lisi';
    }
    say() {
        return 'lala';
    }
}
/*********************Narrowing******************************* */
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html
// 类型收窄
const upperCase = (content) => {
    if (typeof content === 'string') {
        return content.toUpperCase();
    }
    return content;
};
// 真值收窄: 判断条件是boolean值
const getString = (content) => {
    if (content) {
        return content.toUpperCase();
    }
    return content;
};
// 相等收窄
const example = (x, y) => {
    // 类型相等为string
    if (x === y) {
        return x.toUpperCase();
    }
};
const test = (animal) => {
    if ('swim' in animal) {
        return animal.swim;
    }
    // 语法自动补全会主动只展示fly这个方法属性，不会出现swim
    return animal.fly;
};
// instanceof 语法下的类型收窄
const test1 = (params) => {
    if (params instanceof Date) {
        return params.getDate();
    }
    return params.toLocaleLowerCase();
};
//  animal is Fish 类型陈述语法实现类型收窄
const isFish = (animal) => {
    if (animal.swim !== undefined) {
        return true;
    }
    return false;
};
const test3 = (animal) => {
    if (isFish(animal)) {
        return animal.swim();
    }
    return animal.fly();
};
/********************* 泛型 ******************************* */
const getArraFirstItem = (arr) => arr[0];
const numberArr = [1, 2, 3];
getArraFirstItem(numberArr); // 类型推断出number
const stringArr = ['1', '2'];
getArraFirstItem(stringArr); // 类型推断出string
function makeDate(mOrTimestamp, d, y) {
    if (d !== undefined && y !== undefined) {
        return new Date(y, mOrTimestamp, d);
    }
    else {
        return new Date(mOrTimestamp);
    }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3); // No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
/********************* 类的定义与继承 ******************************* */
//1、private， public, protected
// private: 只允许在类的内部被调用
// public: 允许在类的内部和外部调用（未明确定义时，默认的就是public类型）
// protected: 在类的内部，以及继承的子类中可以调用
class Children {
    say() {
        this.name = 'iii';
        this.age = 888;
        console.log('hi');
    }
}
const children = new Children();
// Property 'name' is private and only accessible within class 'Children'.
children.name = 'zhangsan';
children.age = 999;
// 继承的子类
class BigChild extends Children {
    bye() {
        this.name = 'byg';
        this.age = 7777; // protected定义的类型值可以在继承的子类中使用
    }
}
// 2、constructor
class ChildrenOne {
    // 传统写法
    // name: string;
    // constructor(name: string) {
    //     this.name = name;
    // }
    // 简化写法: 在构造函数的参数上使用public等同于创建了同名的成员变量。
    constructor(name) {
        this.name = name;
    }
    ;
}
const childrenone = new ChildrenOne('kakak');
console.log(childrenone.name);
// 3、父类定义的有constructor方法，子类中也定的有，如何处理？
class ChildrenTwo {
    constructor(name) {
        this.name = name;
    }
    ;
}
class ChildrenThree extends ChildrenTwo {
    constructor(age) {
        super('wangwu'); //需要明确调用super;
        this.age = age;
    }
}
const childrenthree = new ChildrenThree(56);
// 4、父类定义的没有constructor方法，子类中定义的有，也需要在constructor中调用super()，如何处理？
class ChildrenFour {
}
class ChildrenSix extends ChildrenFour {
    constructor(age) {
        super(); //需要明确调用super;
        this.age = age;
    }
}
const Childrensix = new ChildrenSix(56);
// 5、类的setter， getter用法
class Animal {
    constructor(name) {
        this.name = name;
    }
    ;
}
const animal = new Animal('dog');
// Property 'name' is private and only accessible within class 'Animal'.
console.log(animal.name);
// 利用setter、getter可以对私有属性进行取值和改写
class AnimalDemo {
    constructor(_name) {
        this._name = _name;
    }
    ;
    // 访问器仅在针对ECMAScript 5及更高版本时可用。在tsconfig中进行配置。
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = 'kaka' + name;
    }
}
const animaldemo = new AnimalDemo('dog');
// Property 'name' is private and only accessible within class 'Animal'.
console.log(animaldemo.name);
animaldemo.name = 'cat';
