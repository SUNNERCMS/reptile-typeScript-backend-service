import superagent from 'superagent';

class Crowller {
    private key = 'x3b174jsx';
    private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.key}`;
    public rowHtml = '';
    async getRowHtml() {
        const data = await superagent.get(this.url);
        this.rowHtml = data.text;
    }

    constructor() {
        this.getRowHtml();
    }

}

const crowller = new Crowller();
console.log('fanfa===:', crowller);