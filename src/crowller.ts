import superagent from 'superagent';
import cheerio from 'cheerio';

interface Course{
    title: string,
    count: number
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
    }

    async getRowHtml() {
        const data = await superagent.get(this.url);
        this.getCourseInfo(data.text);
    }

    constructor() {
        this.getRowHtml();
    }

}

const crowller = new Crowller();