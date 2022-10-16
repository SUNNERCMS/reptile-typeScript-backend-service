"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 专门处理爬虫数据
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = __importDefault(require("fs"));
class Analyer {
    // 单例模式：私有化constructor，实例化类只能在类内部进行，外部想获取实例可以通过类方法获取
    constructor() { }
    // 单例模式: static定义静态方法，不能在类的实例上调用静态方法，而应该通过类本身调用
    static getInstance() {
        if (!Analyer.instance) {
            Analyer.instance = new Analyer();
        }
        return Analyer.instance;
    }
    // 从html中爬取需要的数据
    getCourseInfo(html) {
        const $ = cheerio_1.default.load(html);
        const courseItems = $('.course-item');
        const courseInfo = [];
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
    // 生存需要保存的爬虫数据
    generateJsonContent(courseResult, filePath) {
        let fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[courseResult.time] = courseResult.data;
        return JSON.stringify(fileContent);
    }
    // 爬虫数据处理的主函数
    analyer(html, filePath) {
        // 提取想要的数据
        const courseResult = this.getCourseInfo(html);
        // 生成需要存储的数据格式
        return this.generateJsonContent(courseResult, filePath);
    }
}
exports.default = Analyer;
