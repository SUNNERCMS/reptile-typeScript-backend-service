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


