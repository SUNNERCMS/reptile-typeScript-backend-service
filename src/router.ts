import {Router, Request, Response} from 'express';
import Crowller from './crowller';
import Analyer from './analyer';
import {isLogin} from './utils';
import fs from 'fs';
import path from 'path';

const router = Router();

export interface RequestWithBody extends Request{
    body: {
        [key: string]: string | undefined
    }
}

router.get('/', (req: Request, res: Response) => {
    if(isLogin(req)) {
        res.send(`
            <html>
                <body>
                    <a href='./getData'>爬取数据</a>
                    <a href='./showData'>展示内容</a>
                    <a href='./logout'>退出</a>
                </body>
            </html>
        `);
    } else {
        res.send(`
            <html>
                <body>
                    <form method="post" action="/login">
                        <input type="password" name="password"/>
                        <button>登录</button>
                    </form>
                </body>
            </html>
        `);
    }
});

router.post('/login', (req: RequestWithBody, res: Response) => {
    // body需要用body-parse中间件进行解析，保证始终有body字段
    const {password} = req.body;
    if(isLogin(req)) {
        res.send('已经登录过了');
    } else {
        if(password === '123' && req.session) {
            req.session.loginStatus = true;
            res.send('登录成功');
        } else {
            res.send('登录失败');
        }
    }
});

router.get('/logout', (req: RequestWithBody, res: Response) => {
    if(req.session) {
        req.session.loginStatus = false;
    };
    // 退出登录之后，回到根路径页面
    res.redirect('/');
});

router.get('/getData', (req: RequestWithBody, res: Response) => {
    if(isLogin(req)) {
        // 创建爬虫类触发爬虫的数据获取
        // 网页key
        const key = 'x3b174jsx';
        const url = `http://www.dell-lee.com/typescript/demo.html?secret=${key}`;
    
        // 获取分析器实例
        const analyer = Analyer.getInstance();
        new Crowller(analyer, url);
        res.send('口令正确并爬取数据');
    } else {
        res.send(`${req.customProperty}-请登录后爬取数据`)
    }
});

router.get('/showData', (req: RequestWithBody, res: Response) => {
    // 避免course.json文件没有创建报错
    try {
        if(isLogin(req)) {
            const dataPath = path.resolve(__dirname, '../data/course.json');
            const courseData = fs.readFileSync(dataPath, 'utf-8');
            res.send(JSON.parse(courseData));
        } else {
            res.send('请先登录');
        }
    } catch {
        res.send('暂时爬取不到内容');
    }
});

export default router;

