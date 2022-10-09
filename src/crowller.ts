import superagent from 'superagent';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

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

class Crowller {
    private key = 'x3b174jsx';
    private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.key}`;

    getCourseInfo(html: string) {
        const $ = cheerio.load(html);
        const courseItems = $('.course-item');
        const courseInfo: Course[]= [];
        courseItems.map((index, element) => {
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

    async getRowHtml() {
        const data = await superagent.get(this.url);
        return data.text;
    }

    // 将获取到的爬虫数据写入文件
    generateJsonContent(courseResult: CourseResult) {
        const filePath = path.resolve(__dirname, '../data/course.json');
        let fileContent: FileContent = {};
        if(fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        fileContent[courseResult.time] = courseResult.data;
        fs.writeFileSync(filePath, JSON.stringify(fileContent));
    }

    async initSpiderProcess() {
        // 爬取原始数据
        const html = await this.getRowHtml();
        // 提取想要的数据
        const courseResult: CourseResult = this.getCourseInfo(html);
        // 数据存储处理
        this.generateJsonContent(courseResult);
    }

    constructor() {
        this.initSpiderProcess();
    }

}

new Crowller();