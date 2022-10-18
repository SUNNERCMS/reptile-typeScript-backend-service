/*
官方文档：https://www.typescriptlang.org/docs/handbook/2/basic-types.html
*/

import { type } from "os";

/*************************基础类型快速入门***************************** */
let lala:string = 'sun';
lala = 'ii';

// 数组
const arr: number[] = [9, 8];
const arrDemo: Array<string> = ['99', 'kk'];
const arrdemoOne: (number | string)[] = ['fdf', 9];
const arrdemoTwo: {name: string, age: number}[] = [{name: 'aaa', age: 999}];

// 元组tuple
const arrtuple: [string, string, number] = ['liming', 'boy', 19];

// 参数类型，函数类型
const showMessage = (age: number): number => age;
// 函数类型整体定义
const show: (message: string) => string = (message: string) => 'lalalal';

// 接口类型
interface Student {
    age: number;
    sex?: string; // 可有可无
}
const xiaoming: Student = {age: 12, sex: 'boy'}

// 类型扩展：优先使用接口类型interface
interface StudentNew extends Student {
    name?: string; // 可有可无
}
const liming: StudentNew = {age: 12, sex: 'boy', name: 'liming'}

// 多个对象类型同时继承
interface Circle {
    radius: number
}
interface Color {
    color: string
}

interface CricleOrColor extends Circle, Color {};

const circleColor: CricleOrColor = {radius: 333, color: 'red'};

// 类型别名type
type User = {
    age: number,
    sex?: string
}
const xiaomingtype: User = {age: 34};
// 类型扩展：交叉类型实现
type UserNew = User & {name: string};
const liming01: UserNew = {age: 23, sex: 'boy', name: 'liming'}

// 断言作用及写法 assersion
const dom: HTMLElement = document.getElementById('#root');
const dom01: undefined = document.getElementById('#root') as undefined;
const dom02: undefined = <undefined>document.getElementById('#root');

//字面量类型：更加精确限制
const request = (url: string, method: 'GET' | 'POST'): object => {
    return {
        data: 'lalal'
    }
};
const params: {url: string, method: string} = {
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
const testNullType: null = undefined;
const testUndefinedType: undefined = null;

// void 类型：定义函数返回为空
const demofunc = (): void => {};

/*************************类型注解和类型推断***************************** */
// 1、类型注解： 主动添加声明的类型
// 2、类型推断：根据定义内容或者已有类型，进行推断
// 如果可以自动推断出类型，就没必要手动去写注解啦
const getTotal = (paramsOne: number, paramTwo: number) => paramsOne + paramTwo;

// 3、解构形式的类型注解
const demoOne = ({a, b}: {a: number, b: number}) => a + b;
demoOne({a: 1, b: 2});

interface demoType {
    a:number;
    b:string
}
const demoTwo = ({a, b}: demoType) => a + b;
demoTwo({a: 3, b: 'f'});

// 4、Function Type Expressions的类型注解
interface FnType {
    (a: string): void
};
const fnFunction = (param: string) => console.log(param);
// greeter函数会根据传入fn函数的执行结果，来推断greeter函数的返回类型
const greeter = (fn: FnType) => {
    return fn('mao')
};
greeter(fnFunction);

// 5、有属性的函数类型定义写法
interface FunctionWithAttributes {
    attr: string;
    (str: string): void; // 使用：代替了 =>
}

const testdemo: FunctionWithAttributes = (str: string) => console.log(str);
testdemo.attr = 'attributes';

// 6、构造函数的类型注解
interface ClassWithConstructor {
    new (str: string): void;
}

const constructorDemo = (ctor: ClassWithConstructor) => {
    return new ctor('lala');
}

class ctorCl {
    name: string;
    constructor(str: string) {
        this.name = str;
    }
}
constructorDemo(ctorCl);

// 练习：Date对象的类型注解写法
// var d = new Date("July 21, 1983 01:15:00");
// var n = d.getDate(); // 21
interface CallOrConstruct {
    new (s: string): Date;
    (n?: number): number
}

// 7、对象类型只读属性
interface Person {
    readonly name: string,
    age: number
}
const sun: Person = {
    name: 'lalal',
    age: 44
}
sun.name = 'lll';

// 8、对象属性扩展类型
interface PersonDemo {
    name: string,
    [key: string]: number | string // key值匹配+联合类型
}
const zhao: PersonDemo = {
    name: 'alala',
    age: 44
}

// 9、字面量对象和直接对象类型注解的区别
interface PersonDemoOne {
    name: string;
    age?: number
};

const getPerson = (person: PersonDemoOne) => {
    console.log(person.name);
}

const personParam = {
    name: 'lalal',
    sex: 'boy'
}

// 字面量的形式：只要其中有接口声明的类型即可，可以多出一部分属性，也不会提示报错
getPerson(personParam);
getPerson({
    name: 'xiaohai',
    sex: 'girl' // 会进行强校验，字段类型必须都能匹配上
})

// 10、class类应用接口
interface PersonDemoTwo {
    name: string;
    age?: number;
    say(): string
};
// 类中需要有接口中声明的必须数据
class PersonDemoThird implements PersonDemoTwo {
    name = 'lisi';
    say() {
        return 'lala'
    }
}




/*********************Narrowing******************************* */
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html

// 1、类型收窄
const upperCase = (content: string | number) => {
    if (typeof content === 'string') {
        return content.toUpperCase();
    }
    return content;
}

// 2、真值收窄: 判断条件是boolean值
const getString = (content?: string) => {
    if (content) {
        return content.toUpperCase();
    }
    return content;
}

// 3、相等收窄
const example = (x: string | number, y: string | boolean) => {
    // 类型相等为string
    if (x === y) {
        return x.toUpperCase();
    }
}

// 4、使用 in 实现类型收窄
type Fish = {
    swim: () => {}
} 
type Bird = {
    fly: () => {}
}
const test = (animal: Fish | Bird) => {
    if('swim' in animal) {
        return animal.swim;
    }
    // 语法自动补全会主动只展示fly这个方法属性，不会出现swim
    return animal.fly;
}

// 5、instanceof 语法下的类型收窄
const test1 = (params: Date | string) => {
    if(params instanceof Date) {
        return params.getDate();
    }
    return params.toLocaleLowerCase();
}


// 6、animal is Fish 类型陈述语法实现类型收窄
const isFish = (animal: Fish | Bird): animal is Fish => {
    if((animal as Fish).swim !== undefined) {
        return true;
    }
    return false;
}
const test3 = (animal: Fish | Bird) => {
    if(isFish(animal)) {
        return animal.swim();
    }
    return animal.fly();
}

// 7、instanceof 判断基本数据类型的方法-类型收窄进行类型保护
class NumberObj {
    count: number
}
const traninAnimal03 = (param01: NumberObj | number, param02: NumberObj | number) => {
    if (param01 instanceof NumberObj && param02 instanceof NumberObj) {
        return param01.count + param02.count;
    } else {
        return 0;
    }
}
/********************* 泛型 ******************************* */
const getArraFirstItem = <Type>(arr: Type[]) => arr[0];

const numberArr = [1, 2, 3];
getArraFirstItem(numberArr); // 类型推断出number

const stringArr = ['1', '2'];
getArraFirstItem(stringArr); // 类型推断出string


/********************* 函数重载 ******************************* */
/*
https://www.tslang.cn/docs/handbook/functions.html
https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
JavaScript本身是个动态语言。 JavaScript里函数根据传入不同的参数而返回不同类型的数据是很常见的。
但是这怎么在类型系统里表示呢？
方法是为同一个函数提供多个函数类型定义来进行函数重载。 编译器会根据这个列表去处理函数的调用
在定义重载的时候，一定要把最精确的定义放在最前面。
*/
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;

function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
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
    private name: string;
    protected age: number;
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
        this.name='byg';
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
    constructor(public name: string){};
}
const childrenone = new ChildrenOne('kakak');
console.log(childrenone.name);

// 3、父类定义的有constructor方法，子类中也定的有，如何处理？
class ChildrenTwo {
    constructor(public name: string){};
}
class ChildrenThree extends ChildrenTwo {
    constructor(public age: number) {
        super('wangwu'); //需要明确调用super;
    }
}
const childrenthree = new ChildrenThree(56);

// 4、父类定义的没有constructor方法，子类中定义的有，也需要在constructor中调用super()，如何处理？
class ChildrenFour {
}
class ChildrenSix extends ChildrenFour {
    constructor(public age: number) {
        super(); //需要明确调用super;
    }
}
const Childrensix = new ChildrenSix(56);

// 5、类的setter， getter用法
class Animal {
    constructor(private name: string){};
}
const animal = new Animal('dog');
// Property 'name' is private and only accessible within class 'Animal'.
console.log(animal.name);

// 利用setter、getter可以对私有属性进行取值和改写
class AnimalDemo {
    constructor(private _name: string){};
    // 访问器仅在针对ECMAScript 5及更高版本时可用。在tsconfig中进行配置。
    get name() {
        return this._name;
    }
    set name(name: string) {
        this._name = 'kaka' + name;
    }
}
const animaldemo = new AnimalDemo('dog');
// Property 'name' is private and only accessible within class 'Animal'.
console.log(animaldemo.name);
animaldemo.name = 'cat';

/********************* 4-4 Union Types联合类型+类型收窄Narrowing ******************************* */
interface BigBird {
    fly: boolean,
    sing: () => {}
}
interface BigDog {
    fly: boolean,
    bark: () => {}
}
// 1、boolean+类型断言的代码收窄方式进行类型保护
const traninAnimal = (animal: BigBird | BigDog) => {
    if (animal.fly) {
        (animal as BigBird).sing();
    } else {
        (animal as BigDog).bark();
    }
}
// 2、in:属性值是否在接口的类型中，收窄进行类型保护
const traninAnimal01 = (animal: BigBird | BigDog) => {
    if ('sing' in animal) {
        animal.sing()
    } else {
        animal.bark();
    }
}
// 3、typeof判断属性类型收窄进行类型保护
const traninAnimal02 = (param01: string | number, param02: string | number) => {
    if (typeof param01 === 'string' || typeof param02 === 'string') {
        return `${param01}${param02}`
    } else {
        return param01 + param02
    }
}
// 4、instanceof 判断基本数据类型的方法-类型收窄进行类型保护
class NumberObjType {
    count: number
}
const traninAnimal04 = (param01: NumberObjType | number, param02: NumberObjType | number) => {
    if (param01 instanceof NumberObjType && param02 instanceof NumberObjType) {
        return param01.count + param02.count;
    } else {
        return 0;
    }
}

/********************* 4-5 Enum枚举类型 **********************/
// typescript支持枚举类型，js没有枚举类型
// 枚举类型特性：（1）默认下标从0开始映射（2）支持正反向匹配（3）设置映射值后，后续映射值依赖前者定义
enum status {
    offline,
    online,
    delete
}
console.log(status.offline); // 0
console.log(status.online); // 1
console.log(status.delete); // 2
console.log(status[0]) // 'offline'

enum status01 {
    offline,
    online = 4,
    delete
}
console.log(status01.offline); // 0
console.log(status01.online); // 4
console.log(status01.delete); // 5
console.log(status01[2]) // 'undefined'

/********************* 4-6 函数泛型 **********************/
// 泛型：泛指的类型，在定义时不具体指明，在使用时指定
// 特点：（1）类型注解类型行参和实参（2）支持多个类型
const generic = <T, P>(params01: T, params02: P) => {
    return params01 && params02
}
// 使用时指明定义
generic<string, number>('lll', 888);
// 简写，由参数类型进行推断
generic('lll', 888);

// params01: Array<T>
const generic01 = <T>(params01: T[]): T[] => {
    return params01
}
generic01<number>([888]);
generic01<string>(['hah']);

/********************* 4-7 类中的泛型及泛型类型 **********************/
// (1)使用类时指明泛型（2）泛型可使用继承extends: 要求泛型中必须包含继承者中的内容 (3)用泛型声明类型进行类型注解
class ClassGeneric<T> {
    constructor(private data: T){};
    getItem(index: number): T {
        return this.data[index];
    }
}
// const classgeneric = new ClassGeneric('hello');
const classgeneric = new ClassGeneric<string>('hello');
console.log(classgeneric.getItem(0))

// 使用extends继承，限定或者扩展一些类型注解
interface Item {
    name: string
} 
class ClassGeneric02<T extends Item> {
    constructor(private data: T[]){};
    getItem(index: number): T {
        return this.data[index];
    }
}
// const classgeneric = new ClassGeneric('hello');
const classgeneric02 = new ClassGeneric02([{name: 'jajaj'}]);
console.log(classgeneric02.getItem(0))

class ClassGeneric03<T extends string | number> {
    constructor(private data: T[]){};
    getItem(index: number): T {
        return this.data[index];
    }
}

const classgeneric03 = new ClassGeneric03(['sun', 'nercms']);
console.log(classgeneric03.getItem(0))

// 泛型声明
function hello<T>(param: T){
    return param
}
// 泛型声明了函数hello的类型：要求函数必须是一个接受泛型的函数
const func: <T>(param: T) => T = hello;
func<string>('hello');

/********************* 4-8 Namespaces命名空间 **********************/
// 官方文档： https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html
/* 1、Using Namespaces
（1）Namespaces are simply named JavaScript objects in the global namespace
namespace只是全局变量中定义命名的js对象。
（2）they can span multiple files，and can be concatenated using outFile.
namespace可以贯穿分布在多个文件，也可以使用outFile进行输出的集成。
（3）you can’t use the outFile option while targeting commonjs or umd, but with TypeScript 1.8 and later, it’s possible to use outFile when targeting amd or system.
outFile：导出的js文件配置只支持amd和system。
2、Using Modules
（1）Modules provide for better code reuse, stronger isolation and better tooling support for bundling.
module提供了更好的代码复用，代码隔离，以及为bundle提供了更好的工具支持。
（2）It is also worth noting that, for Node.js applications, modules are the default and we recommended modules over namespaces in modern code.
还值得注意的是，对于Node.js应用程序来说，模块是默认的，我们在现代代码中推荐模块而不是命名空间。
（3）Starting with ECMAScript 2015, modules are native part of the language, and should be supported by all compliant engine implementations.
 Thus, for new projects modules would be the recommended code organization mechanism.
 从ECMAScript 2015开始，模块是语言的原生部分，所有兼容的引擎实现都应该支持。因此，对于新项目来说，模块将是推荐的代码组织机制。
*/

/********************* 4-12 描述文件中的全局类型（.d.ts类型声明文件） **********************/
// 1、declare声明：.d.ts的顶级声明必须以declare开头
// 2、以declare声明的变量和模块后，其他地方不需要引入，就可以直接使用了
// 3、在声明文件中 type 与 interface 也可以不用加declare ，效果相同
// 相关文档：【ts类型声明文件的正确使用姿势】https://blog.csdn.net/hcz804933522/article/details/104013775
// 官方相关文档：【Declaration Files】https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html

//Use declare namespace to describe types or values accessed by dotted notation.（使用声明命名空间来描述通过点分符号访问的类型或值。）
declare namespace myLib {
    function makeGreeting(s: string): string;
    let numberOfGreetings: number;
}

let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);
let count = myLib.numberOfGreetings;

// Use an interface to define a type with properties.（使用接口来定义一个带有属性的类型）
interface GreetingSettings {
    greeting: string;
    duration?: number;
    color?: string;
  }
declare function greet(setting: GreetingSettings): void;

greet({
    greeting: "hello world",
    duration: 4000
});

// You can use a type alias to make a shorthand for a type（可以使用一个类型别名来为一个类型做一个简写）
type GreetingLike = string | (() => string) | MyGreeter;
declare function greet(g: GreetingLike): void;

function getGreeting() {
    return "howdy";
}
class MyGreeter extends Greeter {}
greet("hello");
greet(getGreeting);
greet(new MyGreeter());

// Use declare class to describe a class or class-like object. Classes can have properties and methods as well as a constructor.（使用 declare class 来描述类或类对象。类可以具有属性和方法以及构造函数。）
declare class Greeter {
    constructor(greeting: string);
    greeting: string;
    showGreeting(): void;
}

const myGreeter = new Greeter("hello, world");
myGreeter.greeting = "howdy";
myGreeter.showGreeting();
class SpecialGreeter extends Greeter {
constructor() {
    super("Very special greetings");
    }
}

// Use declare var to declare variables. If the variable is read-only, you can use declare const. You can also use declare let if the variable is block-scoped. 
// （使用 declare var 来声明变量。如果变量是只读的，则可以使用 declare const。如果变量是块范围的，您也可以使用 declare let。）
declare var foo: number;
console.log("Half the number of widgets is " + foo / 2);

// Use declare function to declare functions.
declare function greet(greeting: string): void;
greet("hello, world");