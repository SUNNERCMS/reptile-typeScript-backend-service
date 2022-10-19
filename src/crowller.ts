import superagent from 'superagent';
import fs from 'fs';
import {AnalyerType} from './analyer';
import path from 'path';

// 爬虫类
class Crowller {
    private filePath = path.resolve(__dirname, '../data/course.json');

    // superagent获取页面数据
    private async getRowHtml() {
        const data = await superagent.get(this.url);
        return data.text;
    }

    // 爬虫类处理整体流程方法
    private async initSpiderProcess() {
        // 爬取原始数据
        const html = await this.getRowHtml();
        // 通过专门的分析器进行数据处理
        const storeData = this.analyer.analyer(html, this.filePath);
        // 将爬取的数据进行落库保存
        fs.writeFileSync(this.filePath, storeData);
    }

    // 在构造函数的参数上使用public等同于创建了同名的成员变量。
    constructor(public analyer: AnalyerType, public url: string) {
        this.initSpiderProcess();
    }
}

export default Crowller;
