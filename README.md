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

