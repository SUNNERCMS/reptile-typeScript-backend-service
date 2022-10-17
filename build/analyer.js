"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = __importDefault(require("fs"));
class Analyer {
    constructor() { }
    static getInstance() {
        if (!Analyer.instance) {
            Analyer.instance = new Analyer();
        }
        return Analyer.instance;
    }
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
    generateJsonContent(courseResult, filePath) {
        let fileContent = {};
        if (fs_1.default.existsSync(filePath)) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[courseResult.time] = courseResult.data;
        return JSON.stringify(fileContent);
    }
    analyer(html, filePath) {
        const courseResult = this.getCourseInfo(html);
        return this.generateJsonContent(courseResult, filePath);
    }
}
exports.default = Analyer;
