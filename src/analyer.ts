// 数据分析器-处理爬虫数据
import cheerio from 'cheerio';
import fs from 'fs';

interface Course{
    title: string,
    count: number
}
interface CourseResult{
    time: number,
    data: Course[]
}

interface FileContent{
    [key: number]: Course[]
}

// 自定义类的类型注解：必须有analyer，且接受两个参数，返回内容字符串
export interface AnalyerType{
    analyer: (html: string, filePath: string) => string
}

export default class Analyer implements AnalyerType {
    private static instance: Analyer;
    // 单例模式: static定义静态方法，不能在类的实例上调用静态方法，而应该通过类本身调用
    static getInstance() {
        if(!Analyer.instance) {
            Analyer.instance = new Analyer();
        }
        return Analyer.instance;
    }
    // 从html中爬取需要的数据
    private getCourseInfo(html: string) {
        const $ = cheerio.load(html);
        const courseItems = $('.course-item');
        const courseInfo: Course[]= [];
        courseItems.map((_, element) => {
            const descs = $(element).find('.course-desc');
            const title = descs.eq(0).text();
            const count = parseInt(descs.eq(1).text().split('：')[1], 10);
            courseInfo.push({
                title,
                count
            });
        });
        const result = {
            time: new Date().getTime(),
            data: courseInfo
        };
        return result;
    }

    // 生存需要保存的爬虫数据
    private generateJsonContent(courseResult: CourseResult, filePath: string) {
        let fileContent: FileContent = {};
        if(fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        fileContent[courseResult.time] = courseResult.data;
        return JSON.stringify(fileContent);
    }

    // 爬虫数据处理的主函数
    analyer(html: string, filePath: string) {
        // 提取想要的数据
        const courseResult: CourseResult = this.getCourseInfo(html);
        // 生成需要存储的数据格式
        return this.generateJsonContent(courseResult, filePath);
    }

    // 单例模式：私有化constructor，实例化类只能在类内部进行，外部想获取实例可以通过类方法获取
    private constructor() {}
}