# reptile-typeScript-project
基于typeScript实现爬虫开发

## v1: 爬虫流程整体实现
##### 1、Crowller爬虫类主要构成：
- initSpiderProcess：（1）爬取原始数据（2）提取想要的数据（3）数据存储处理
```js
    async initSpiderProcess() {
        // 爬取原始数据
        const html = await this.getRowHtml();
        // 提取想要的数据
        const courseResult: CourseResult = this.getCourseInfo(html);
        // 数据存储处理
        this.generateJsonContent(courseResult);
    }
```
##### 2、补充知识点：
- 涉及npm包：
（1）superagent: 客户端http请求包，可用于node模块  
（2）cheerio：类似jquery的语法，方便操作处理网页数据。  

- 文件处理fs:
node模块的核心包fs，用于处理文件
（1）判断文件是否存在 `fs.existsSync(filePath)`  
（2）读文件 `fs.readFileSync(filePath, 'utf-8')`  
（3）写文件 `fs.writeFileSync(filePath, JSON.stringify(fileContent))`  
## v2: 组件模式完善爬虫架构并构建数据分析器
##### 1、Analyer分析类
专门处理爬虫数据
```js
    // 爬虫数据处理的主函数
    analyer(html: string, filePath: string) {
        // 提取想要的数据
        const courseResult: CourseResult = this.getCourseInfo(html);
        // 生成需要存储的数据格式
        return this.generateJsonContent(courseResult, filePath);
    }  
```
##### 2、补充知识点：
- 自定义类的类型注解，可以根据类的具体内容，加上相应的注解
```js
// 自定义类的类型注解：必须有analyer，且接受两个参数，返回内容字符串
export interface AnalyerType{
    analyer: (html: string, filePath: string) => string
}

// 通过implements给类加注解: 类中需要有接口(AnalyerType)中声明的必须数据
export default class Analyer implements AnalyerType { 
    XXX
}
```

- 在构造函数的参数上使用public创建同名的成员变量
```js
   // 在构造函数的参数上使用public等同于创建了同名的成员变量。
    constructor(public analyer: AnalyerType, public url: string) {
        this.initSpiderProcess();
    }
```
## v3: 分析器单例模式优化
1、构造函数私有化。
> 避免外部进行实例化，是否有实例的判断做到类里面   
```js
    // 单例模式：私有化constructor，实例化类只能在类内部进行，外部想获取实例可以通过类方法获取
    private constructor() {}
```


2、静态方法定义实例获取。
> 通过类方法进行实例的获取，一般都是在实例上调用方法，由于类的实例在类中进行，外部没法通过实例获取类定义的方法，但静态类型定义的方法，可以通过类获取到。即：static定义静态方法，不能在类的实例上调用静态方法，而应该通过类本身调用   
```js
    private static instance: Analyer;
    // 单例模式: static定义静态方法，不能在类的实例上调用静态方法，而应该通过类本身调用
    static getInstance() {
        if(!Analyer.instance) {
            Analyer.instance = new Analyer();
        }
        return Analyer.instance;
    }
```

3、外部使用实例。
> 外部通过静态方法获取实例，保证实例的唯一性。   
```js
const analyer = Analyer.getInstance();
...
// 通过专门的分析器进行数据处理
const storeData = this.analyer.analyer(html, this.filePath);
```
## v4: 完善ts开发编辑过程
```js
  "scripts": {
    "dev": "ts-node ./src/crowller.ts",
    "build": "tsc -w",
    "start": "nodemon ./build/crowller.js"
  },
```
1、`npm run dev`: 利用ts-node现将ts进行了js编译，然后进行了执行。   
2、`npm run build`: 执行完之后，会将所有的ts文件进行js编译，但生成的js文件和ts文件时混在一起的，可以利用tsconfig.json进行产出文件配置。 -w:会自动监听ts文件的变化，进行js的重新编译。  
> "outDir": "./build", 该配置可指定路径和文件名，且生成的js文件会按照ts的目录层级对应生成。  
3、`npm run start`: 执行之后，会先用node执行一遍./build/crowller.js，然后监听该文件的变化，只要有变化就会重新执行。  

命令2和命令3同时启动，改变ts文件变化后，就可以直接执行js。（1）一个监听ts文件变化，更新js，一个监听js文件变化，执行js文件。
> 前端工程化并行解决方案： concurrently

##### 借助一些工具提高ts开发编译的效率：  
1、nodeman: nodemon 是一种工具，可在检测到目录中的文件更改时通过自动重新启动节点应用程序来帮助开发基于 node.js 的应用程序。
> "start": "nodemon ./build/crowller.js"
```js
[nodemon] clean exit - waiting for changes before restart
[nodemon] restarting due to changes...
[nodemon] starting `node ./build/crowller.js`
```

2、concurrently: Run multiple commands concurrently
```js
 "dev-build": "tsc -w",
 "dev-start": "nodemon ./build/crowller.js",
 "start": "concurrently npm:dev-*"
```
> npm run start:即同时运行dev-build和dev-start

## v5: ts泛型 + namespace + Declaration Reference
#### v5-1 泛型
泛型：泛指的类型，在定义时不具体指明，在使用时指定
#### v5-1-1 函数泛型
特点：（1）类型注解类型行参和实参（2）支持多个类型

```ts
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
```
#### v5-1-2 类中的泛型及泛型类型
- 使用类时指明泛型  
- 泛型可使用继承extends: 要求泛型中必须包含继承者中的内容  
- 用泛型声明类型进行类型注解
```ts
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
```

#### v5-2 Namespaces命名空间
官方文档： https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html  

###### 1、Using Namespaces
（1）Namespaces are simply named JavaScript objects in the global namespace
> namespace只是全局变量中定义命名的js对象。  

（2）they can span multiple files，and can be concatenated using outFile.
> namespace可以贯穿分布在多个文件，也可以使用outFile进行输出的集成。  

（3）you can’t use the outFile option while targeting commonjs or umd, but with TypeScript 1.8 and later, it’s possible to use outFile when targeting amd or system.  

> outFile：导出的js文件配置只支持amd和system。

###### 2、Using Modules
（1）Modules provide for better code reuse, stronger isolation and better tooling support for bundling.  
> module提供了更好的代码复用，代码隔离，以及为bundle提供了更好的工具支持。  

（2）It is also worth noting that, for Node.js applications, modules are the default and we recommended modules over namespaces in modern code.
> 还值得注意的是，对于Node.js应用程序来说，模块是默认的，我们在现代代码中推荐模块而不是命名空间。  

（3）Starting with ECMAScript 2015, modules are native part of the language, and should be supported by all compliant engine implementations.
 Thus, for new projects modules would be the recommended code organization mechanism.
 > 从ECMAScript 2015开始，模块是语言的原生部分，所有兼容的引擎实现都应该支持。因此，对于新项目来说，模块将是推荐的代码组织机制。  

#### v5-2  Declaration Reference
描述文件中的全局类型（.d.ts类型声明文件）
相关文档：[ts类型声明文件的正确使用姿势](https://blog.csdn.net/hcz804933522/article/details/104013775  
)
官方相关文档：[Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html)

declare声明的特点：
- declare声明：.d.ts的顶级声明必须以declare开头  

- 以declare声明的变量和模块后，其他地方不需要引入，就可以直接使用了  

- 在声明文件中 type 与 interface 也可以不用加declare ，效果相同

##### 1、Objects with Properties
Use declare namespace to describe types or values accessed by dotted notation.
>（使用声明命名空间来描述通过点分符号访问的类型或值。）
```js
declare namespace myLib {
    function makeGreeting(s: string): string;
    let numberOfGreetings: number;
}

let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);
let count = myLib.numberOfGreetings;
```

##### 2、Reusable Types (Interfaces)
 Use an interface to define a type with properties.
 > （使用接口来定义一个带有属性的类型）
 ```js
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
```

##### 3、Reusable Types (Type Aliases)
You can use a type alias to make a shorthand for a type
>（可以使用一个类型别名来为一个类型做一个简写）

 ```js
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
```
##### 4、Classes
Use declare class to describe a class or class-like object. Classes can have properties and methods as well as a constructor.
>（使用 declare class 来描述类或类对象。类可以具有属性和方法以及构造函数。）
 ```js
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
```


##### 5、Global Variables
Use declare var to declare variables. If the variable is read-only, you can use declare const. You can also use declare let if the variable is block-scoped. 
>（使用 declare var 来声明变量。如果变量是只读的，则可以使用 declare const。如果变量是块范围的，您也可以使用 declare let。）
 ```js
declare var foo: number;
console.log("Half the number of widgets is " + foo / 2);
```


##### 6、Global Functions
 Use declare function to declare functions.

 ```js
declare function greet(greeting: string): void;
greet("hello, world");
```



