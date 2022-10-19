import {Router, Request, Response} from 'express';
import Crowller from './crowller';
import Analyer from './analyer';

const router = Router();

interface RequestWithBody extends Request{
    body: {
        [key: string]: string | undefined
    }
}

router.get('/', (req: Request, res: Response) => {
    res.send(`
        <html>
            <body>
                <form method="post" action="/demo">
                    <input type="password" name="password"/>
                    <button>提交</button>
                </form>
            </body>
        </html>
    `);
});

router.post('/demo', (req: RequestWithBody, res: Response) => {
    // body需要用body-parse中间件进行解析，保证始终有body字段
    const {password} = req.body;
    if(password === '123') {
        // 创建爬虫类触发爬虫的数据获取
        // 网页key
        const key = 'x3b174jsx';
        const url = `http://www.dell-lee.com/typescript/demo.html?secret=${key}`;
    
        // 获取分析器实例
        const analyer = Analyer.getInstance();
        new Crowller(analyer, url);
        res.send('口令正确并爬取数据');
    } else {
        res.send(`${req.customProperty}-口令不对`)
    }
});

export default router;

