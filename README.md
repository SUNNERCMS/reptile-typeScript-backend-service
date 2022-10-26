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

## v6: Express项目结构搭建
官方网址：https://expressjs.com/en/5x/api.html#path-examples  
app.use的使用：https://expressjs.com/en/5x/api.html#app.use
```js
  "scripts": {
    "dev": "ts-node ./src/crowller.ts",
    "dev-build": "tsc -w",
    "dev-start": "nodemon ./build/index.js",
    "start": "tsc && concurrently npm:dev-*"
  },
```
1、完善该指令 "start": "tsc && concurrently npm:dev-*"
> 若果不先运行一次tsc进行编译，那么没有编译出来的index.js文件，会导致找不到index文件  
> Error: Cannot find module '/Users/sunzhaoxiang/Desktop/reptile-typeScript-project/index.js'    

2、将爬虫类的创建，放到路由匹配的回调函数中
```js
router.get('/demo', (req: Request, res: Response) => {
    // 创建爬虫类触发爬虫的数据获取
    // 网页key
    const key = 'x3b174jsx';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${key}`;

    // 获取分析器实例
    const analyer = Analyer.getInstance();
    new Crowller(analyer, url);
    res.send('demo');
});
```
3、使用body-parser进行表单数据的解析
```js
// Series of Middleware
app.use(bodyParseMiddleware, router);

router.post('/demo', (req: Request, res: Response) => {
    // body需要用body-parse中间件进行解析，保证始终有body字段
    if(req.body.password === '123') {
        // 创建爬虫类触发爬虫的数据获取
        // 网页key
        const key = 'x3b174jsx';
        const url = `http://www.dell-lee.com/typescript/demo.html?secret=${key}`;
    
        // 获取分析器实例
        const analyer = Analyer.getInstance();
        new Crowller(analyer, url);
        res.send('口令正确并爬取数据');
    } else {
        res.send('口令不对')
    }
});
```
## v7: 扩展解决Express的类型定义文件问题
##### 问题：  
- 问题1:@types/express类型库，.d.ts类型文件定义不准确问题  

```js
router.post('/demo', (req: Request, res: Response) => {
    // body需要用body-parse中间件进行解析，保证始终有body字段
    const {password} = req.body;
}
```
鼠标放上password实际类型注解是any: `const password: any`  
查看类型注解库中代码发现req.body的注解类型就是any,从body中进行结构获取到的字段类型都是any.  

```js
body: ReqBody;
ReqBody = any`
````  
处理方式：使用继承形式的interface, 对不准确的定义进行完善。
```js
interface RequestWithBody extends Request{
    body: {
        password: string
    }
}

router.post('/demo', (req: RequestWithBody, res: Response) => {
    // body需要用body-parse中间件进行解析，保证始终有body字段
    const {password} = req.body;
}
>>> const password: string
```

- 问题2: 在使用中间件的时候，对req或者res做了修改之后，实际上类型注解并没有相应的改变  

```js
// 注意：自定义的中间件需要放到router中间件之前，否则添加的属性，在页面中拿不到
app.use((req, res, next) => {
    req.customProperty = 'sunnercms'; 
    next();
});
app.use(bodyParseMiddleware, router);

```
校验提示如下：req本身是没有customProperty
> Property 'customProperty' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'

```js
import * as core from 'express-serve-static-core';

interface Request<
    P = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query,
    Locals extends Record<string, any> = Record<string, any>
> extends core.Request<P, ResBody, ReqBody, ReqQuery, Locals> {}
// 追踪看到类型注解文件中Request是继承的core核心模块
declare global {
    namespace Express {
        interface Request {}
        interface Response {}
        interface Application {}
    }
}
```

处理：使用类型融合的形式进行类型注解完善，类型融合实际上是以namespace命名空间为依据进行的融合。
> 创建custom.d.ts文件  

```js
// 类型融合增加了customProperty类型注解
declare namespace Express {
    interface Request {
        customProperty: string | undefined
    }
}

router.post('/demo', (req: RequestWithBody, res: Response) => {
    // body需要用body-parse中间件进行解析，保证始终有body字段
    const {password} = req.body;
    if(password === '123') {
     ......
    } else {
        // 在这里使用了中间件中对req新增的属性，req会主动有customProperty提示，对req或者res做了修改之后，实际上类型注解，通过融合的形式发生了相应的改变 
        res.send(`${req.customProperty}-口令不对`)
    }
});
```
## v8: cookie-session模拟登录
借助[cookie-session](https://www.npmjs.com/package/cookie-session)基于cookie的会话中间件，缓存会话信息。
```js
app.use(cookieSession({
    name: 'session',
    keys: ['key01'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
```
通过缓存登录状态进行登录，登出，数据展示的逻辑处理
```js
router.post('/login', (req: RequestWithBody, res: Response) => {
    // body需要用body-parse中间件进行解析，保证始终有body字段
    const {password} = req.body;
    if(isLogin(req)) {
        res.send('已经登录过了');
    } else {
        if(password === '123' && req.session) {
            req.session.loginStatus = true;
            res.send('登录成功');
        } else {
            res.send('登录失败');
        }
    }
});

router.get('/logout', (req: RequestWithBody, res: Response) => {
    if(req.session) {
        req.session.loginStatus = false;
    };
    // 退出登录之后，回到根路径页面
    res.redirect('/');
});
```
通过文件内容获取及解析，展示爬取到的数据
```js

router.get('/showData', (req: RequestWithBody, res: Response) => {
    // 避免course.json文件没有创建报错
    try {
        if(isLogin(req)) {
            const dataPath = path.resolve(__dirname, '../data/course.json');
            const courseData = fs.readFileSync(dataPath, 'utf-8');
            res.send(JSON.parse(courseData));
        } else {
            res.send('请先登录');
        }
    } catch {
        res.send('暂时爬取不到内容');
    }
});
```

## v9: 统一接口数据结构
res.json 返回json格式的响应数据 
定义接口返回状态：
```js
export const RES_STATUS = {
    SUCCESS: 200,
    HAD_LOGIN: 201,
    FAIL: 400,
    OTHER: 300
}
```

```js
// 格式化接口数据结构
export const formatResponse = (data: any, status: number, errMeg?: string): Result => {
    return {
        status,
        errMeg,
        data
    }
}

router.get('/showData', logStatusCheckMiddleware, (req: RequestWithBody, res: Response) => {
    // 避免course.json文件没有创建报错
    try {
        const dataPath = path.resolve(__dirname, '../data/course.json');
        const courseData = fs.readFileSync(dataPath, 'utf-8');
        res.json(formatResponse(JSON.parse(courseData), RES_STATUS.SUCCESS));
    } catch {
        res.json(formatResponse({}, RES_STATUS.OTHER, '暂获取不到数据'));
    }
});
```

## v10: 装饰器
装饰器通过声明性语法添加了在定义类时扩充类及其成员的能力。
（Decorators add the ability to augment a class and its members as the class is defined, through a declarative syntax.）   

各种装饰器的执行顺序，如下：  
1、先执行实例成员装饰器（非静态的），再执行静态成员装饰器  
2、执行成员的装饰器时，先执行参数装饰器，再执行作用于成员的装饰器  
3、执行完 1、2 后，执行构造函数的参数装饰器；最后执行作用于 class 的装饰器  
#### v10-1 类装饰器
- 装饰器也可以使用箭头函数。
- 可以使用多个装饰器对同一个类进行装饰。
- 类的装饰器接收的参数是构造函数。
- 装饰器执行时机：是在类定义之后便立即进行装饰。
- 装饰器执行顺序：先下后上，先右后左。先后输出：demo02,demo01
执行classDecorator.ts文件后，
```js
// classDecorator.ts
function testDecorator01(constructor: any) {
    console.log('demo01');
}

function testDecorator02(constructor: any) {
    console.log('demo02');
}

@testDecorator01
@testDecorator02
class Test {};
```

1、通过接收的类构造函数，进行属性或者方法的扩展
```js
function testDecorator01(constructor: any) {
    constructor.prototype.getName = () => {
        console.log('demo01');
    }
}
// 装饰器也可以使用箭头函数。
const testDecorator01 = (constructor: any) => {
    constructor.prototype.getName = () => {
        console.log('demo001');
    }
}
@testDecorator01
class Test {};
const test = new Test();
(test as any).getName();
```

2、 通过工厂模式，使装饰器接收额外指定的参数, 扩展装饰器内部逻辑处理
```js
function testDecorator01(isTrue: boolean) {
    if(isTrue) {
        return (constructor: any) => {
            constructor.prototype.getName = () => {
                console.log('demo03');
            }
        }
    } else {
        return () => {}
    }
}
@testDecorator01(true)
class Test {};
const test = new Test();
(test as any).getName();
```

3、实例化的类使用装饰器中的方法
```js
//  new (...args: any[]) => {} 表示这个是一个构造函数，该函数接收很多参数，每个函数都是any类型。
const testDecorator01 = <T extends new (...args: any[]) => {}>(constructor: T) => {
    return class extends constructor {
        name = "girl";
        getName() {
            return this.name;
        }
    }
}
   
@testDecorator01
class Test {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
};
const test = new Test('boy');
console.log(test); // Test { name: 'girl' }, 先执行实例化类时的boy，最后由装饰器进行了属性覆盖。
test.getName(); // Property 'getName' does not exist on type 'Test'
```
test是有类Test实例化得到的，由于Test类中没有getName这个方法，所有会保错，由于可见即便是装饰器扩展了该方法，ts也推断不到。  

处理上面拿不到getName方法的报错可以采用 const classNew=decorator(class)的形式进行类的装饰，然后进行类的实例new classNew，此时new出来的实例就会包含getNama的方法。  

```js
const testDecorator01 = () => <T extends new (...args: any[]) => {}>(constructor: T) => {
    return class extends constructor {
        name = "girl";
        getName() {
            return this.name;
        }
    }
}
   
const classNew = testDecorator01()(class Test {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
});
const test = new classNew('boy');
// console.log(test); // Test { name: 'girl' }, 先执行实例化类时的boy，最后由装饰器进行了属性覆盖。
console.log('res:', test.getName()); // res: girl
```
#### v10-2 方法装饰器
方法装饰器特点：
- 1、对类中方法的装饰，执行时机也是类定义完成之后，而非必要要将类实例化。    
- 2、类方法装饰器的参数：  
（1）target:普通方法，对应的是类的prototype。静态方法，对应的是类的构造函数。  
（2）key: 所修饰的类方法的名称。  
 (3) descriptor: PropertyDecorator, 可以针对类的函数做一些配置，如是否是可获取get，可写writable，可遍历enumerable;  

```js
function getNameDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.writable = false;
};
class Test {
    name:string;
    constructor(name: string) {
        this.name = name;
    }
    @getNameDecorator
    getName() {
        return this.name;
    }
}
const test = new Test('sun');
console.log(test.getName()); //---> sun
test.getName = () => '123'; // ---> '123', 会执行实例重写的类方法，进行方法的覆盖。descriptor.writable = false; 装饰之后会报错提示，不能进行类方法的复写。
```

```js
// descriptor.value: 表示当前所装饰方法的值，这里descriptor.value表示的是getName这个方法。
function getNameDecorator01(target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.value = function() {
        return 'decorator'
    };
};
class Test01 {
    name:string;
    constructor(name: string) {
        this.name = name;
    }
    @getNameDecorator
    getName() {
        return this.name;
    }
}
const test01 = new Test01('sun');
console.log(test01.getName()); //---> decorator

```

#### v10-3 访问器装饰器
[了解下装饰器](https://cloud.tencent.com/developer/article/1768857)  
[Accessor Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html#accessor-decorators)
```js
// 访问器装饰器，setter和getter不能同时设置。
function getNameDecorator03(target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = true;
};
class Test03 {
    private _name: string;
    constructor(name: string) {
        this._name = name;
    }
    @getNameDecorator03
    get name() {
        return this._name;
    }
    set name(name: string) {
        this._name = name;
    }
}
const test03 = new Test03('sun');
test03.name = '999';
console.log('03---', test03.name); //---> decorator
```

#### v10-3 属性装饰器
- 无法直接修改实例上的属性值。
- 属性装饰器修改的是Target.prototype原型上的属性。
- 可以通过返回的descriptor，对属性的descriptor进行重写。
```js
// 属性装饰器，只有两个参数，没有属性描述符，可以让装饰器返回descriptor，进行属性描述符的配置。
function nameDecorator01(target: any, key: string): any {
    const descriptor: PropertyDescriptor = {
        writable: false
    }
    return descriptor;
};
class Test05 {
   @nameDecorator01
   name = 'Test05';
}
const test05 = new Test05();
test05.name = 'yyy'; // Cannot assign to read only property 'name' of object '#<Test05>', writable: true,可设置该属性可写，输出test05---: yyy
console.log('test05---:', test05.name);
```


```js
// 1、第一个参数。如果装饰的是静态方法，则是这个类 Target 本身；如果装饰的是原型方法，则是类的原型对象 Target.prototype
// 2、第二个参数。这个属性的名称
function nameDecorator(target: any, key: string) {
    // 装饰器接收的target是原型对象
    target[key] = 'hahahh';
};
class Test04 {
   @nameDecorator
   name = 'Test04';
}
const test04 = new Test04();
console.log('04---', test04.name); //---> Test04
console.log('04---04', (test04 as any).__proto__.name); //---> hahahh

```
#### v10-3 参数装饰器
- 1、第一个参数。如果装饰的是静态方法的参数，则是这个类Target本身；如果装饰的是原型方法的参数，则是类的原型对象Target.prototype  
- 2、第二个参数。参数所处的函数名称  
- 3、第三个参数，该参数位于函数参数列表的位置下标(number)  
- 不能在箭头函数中的参数填加参数装饰器  
```js
function getPersonParamDecorator(target: any, key: string, paramIndex: number): any {
    console.log('getPersonParamDecorator', target, key, paramIndex); //
};
class Test06 {
   getPerson(name: string, @getPersonParamDecorator age: number) {
        console.log(name, age);
   }
}
const test06 = new Test06();
test06.getPerson('sun', 18);
```
#### v10-3 装饰器应用场景demo: 提取类中方法的公共处理部分
```js
const userInfo: any = undefined;
function catchError(target: any, key: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value; // 装饰的函数, 单独复制给变量，为了在重新定义函数格式时用来执行。
    descriptor.value = function(...args: any) {
        try{
            // 函数参数的处理
            fn.apply(this, args);
        } catch(e) {
            console.log('useInfo 数据有问题');
        }
    }
}
class Test07 {
    @catchError
    getName(name: string) {
        console.log('name', name);
        return userInfo.name();
    }
    @catchError
    getAge() {
        return userInfo.age();
    }
}
const test07 = new Test07();
test07.getName('sun');
```

## v11: metadata元数据
[Metadata](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata) 
[reflect-metadata](https://www.npmjs.com/package/reflect-metadata)

需要设置emitDecoratorMetadata配置项方可将元数据应用在装饰器上。
```js
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

```js
import 'reflect-metadata';

const user = {
    name: 'sun'
};

// metadataKey, metadataValue, target
// 第一个参数：元数据的key
// 第二个参数：元数据的值value
// 第三个参数：元数据挂载的位置
Reflect.defineMetadata('data', 'test', user);
console.log(Reflect.getMetadata('data', user));


// 通过装饰器的形式应用在类时，使用@Reflect.metadata(metadataKey, metadataValue)
// get metadata value of a metadata key on the prototype chain of an object or property
// let result = Reflect.getMetadata(metadataKey, target);
// let result = Reflect.getMetadata(metadataKey, target, propertyKey);
class Test001 {
    @Reflect.metadata('data', 'test001')
    getName() { }
}
console.log(Reflect.getMetadata('data', Test001.prototype, 'getName'));
```

模拟@Reflect.metadata  
各种装饰器的执行顺序，如下：  
1、先执行实例成员装饰器（非静态的），再执行静态成员装饰器  
2、执行成员的装饰器时，先执行参数装饰器，再执行作用于成员的装饰器  
3、执行完 1、2 后，执行构造函数的参数装饰器；最后执行作用于 class 的装饰器  

获取类本身定义的属性或者方法名称，不包括constructor,class定义的方法是不可通过枚举的
```js
// https://juejin.cn/post/6844903875904798734
// class定义的方法是不可通过枚举的，可通过下面的方式验证
// Object.getOwnPropertyDescriptor(classProto, 'testMethod') 
// // {value: ƒ, writable: true, enumerable: false, configurable: true}
export const getRealOwnPropertyNames = (classTarget: ClassWithConstructor): string[] => {
    const classPropertyNames = Object.getOwnPropertyNames(classTarget.prototype);
    const realOwnPropertyNames =  classPropertyNames.filter((itemName: string) => itemName !== 'constructor');
    return realOwnPropertyNames;
}
```
```js
function showData(target: typeof Test002) {
    for(let key of getRealOwnPropertyNames(target)) {
        const data = Reflect.getMetadata('data', target.prototype, key);
        console.log('data===:', data); // name, age
    }
}

// 作用相当于@Reflect.metadata的使用
function setData(metakey: string, metavalue: string) {
    return function(target: Test002, key:string) {
        Reflect.defineMetadata(metakey, metavalue, target, key);
    }
}
@showData
class Test002 {
    @Reflect.metadata('data', 'name')
    getName() {}

    @setData('data', 'age')
    getAge() {}
}

```
##### 相关知识点
[1、for in 和for of的区别](https://www.jianshu.com/p/c43f418d6bf0)  
[2、如何遍历class中的原型方法](https://juejin.cn/post/6844903875904798734)

## v12: 创建控制器和装饰器
控制器：LoginController，用于生成路由的控制器，将路径和执行方法通过装饰器进行绑定。
1、装饰器文件
```js
export const get = (path: string) => {
    return function(target: any, key: string) {
        Reflect.defineMetadata('path', path, target, key); // 也即是将‘/’的路径绑定到home方法上。
    }
}

export const controller = (target: any) => {
    for(let key of getRealOwnPropertyNames(target)) {
        const data = Reflect.getMetadata('path', target.prototype, key);
        console.log('data===:', data); // name, age
    }
}
```
2、控制器定义
```js
// 可以通过面向对象进行改造：将路径通过装饰器绑定到相应的执行函数上
@controller
class LoginController {
    @get('/')
    home(req: Request, res: Response) {
        if(isLogin(req)) {
            res.send(`
                <html>
                    <body>
                        <a href='./getData'>爬取数据</a>
                        <a href='./showData'>展示内容</a>
                        <a href='./logout'>退出</a>
                    </body>
                </html>
            `);
        } else {
            res.send(`
                <html>
                    <body>
                        <form method="post" action="/login">
                            <input type="password" name="password"/>
                            <button>登录</button>
                        </form>
                    </body>
                </html>
            `);
        }
    }
}

export default LoginController;
```
3、控制器使用
```js
router.get('/', loginController.home);
```