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


