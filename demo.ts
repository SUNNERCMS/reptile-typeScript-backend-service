/*
官方文档：https://www.typescriptlang.org/docs/handbook/2/basic-types.html
*/

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
    constructor(str: sting) {
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

// 字面量的形式：只要其中有接口声明的类型即可，可以多处一部分属性，也不会提示报错
getPerson(personParam);
getPerson({
    name: 'xiaohai',
    sex: 'girl' // 回进行强校验，字段类型必须都能匹配上
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

// 类型收窄
const upperCase = (content: string | number) => {
    if (typeof content === 'string') {
        return content.toUpperCase();
    }
    return content;
}

// 真值收窄: 判断条件是boolean值
const getString = (content?: string) => {
    if (content) {
        return content.toUpperCase();
    }
    return content;
}

// 相等收窄
const example = (x: string | number, y: string | boolean) => {
    // 类型相等为string
    if (x === y) {
        return x.toUpperCase();
    }
}

// 使用 in 实现类型收窄
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

// instanceof 语法下的类型收窄
const test1 = (params: Date | string) => {
    if(params instanceof Date) {
        return params.getDate();
    }
    return params.toLocaleLowerCase();
}


//  animal is Fish 类型陈述语法实现类型收窄
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

