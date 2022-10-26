import fs from 'fs';
import path from 'path';
import {Router, Request, Response, NextFunction} from 'express';
import Crowller from './utils/crowller';
import Analyer from './utils/analyer';
import {isLogin, formatResponse} from './utils/util';
import {RES_STATUS} from './config/responseStatus';
import LoginController from './controller/LoginController';

const loginController = new LoginController();

const router = Router();

export interface RequestWithBody extends Request{
    body: {
        [key: string]: string | undefined
    }
}

// 登录态的校验中间件
const logStatusCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 如果已经登录，接着执行后续回调
    if(isLogin(req)) {
        next();
    } else {
        res.send('请先登录')
    }
}

// 可以通过面向对象进行改造：将路径通过装饰器绑定到相应的执行函数上
router.get('/', loginController.home);

router.post('/login', (req: RequestWithBody, res: Response) => {
    // body需要用body-parse中间件进行解析，保证始终有body字段
    const {password} = req.body;
    if(isLogin(req)) {
        res.json(formatResponse({}, RES_STATUS.HAD_LOGIN));
    } else {
        if(password === '123' && req.session) {
            req.session.loginStatus = true;
            res.json(formatResponse({}, RES_STATUS.SUCCESS));
        } else {
            res.json(formatResponse({}, RES_STATUS.FAIL, '登录失败'));
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

router.get('/getData', logStatusCheckMiddleware, (req: RequestWithBody, res: Response) => {
    // 创建爬虫类触发爬虫的数据获取
    // 网页key
    const key = 'x3b174jsx';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${key}`;

    // 获取分析器实例
    const analyer = Analyer.getInstance();
    new Crowller(analyer, url);
    res.json(formatResponse({}, RES_STATUS.SUCCESS, ''));
});

router.get('/showData', logStatusCheckMiddleware, (req: RequestWithBody, res: Response) => {
    // 避免course.json文件没有创建报错
    try {
        const dataPath = path.resolve(__dirname, '../data/course.json');
        const courseData = fs.readFileSync(dataPath, 'utf-8');
        res.json(formatResponse(JSON.parse(courseData), RES_STATUS.SUCCESS));
    } catch {
        res.json(formatResponse({}, RES_STATUS.OTHER, '暂获取不到数据'));
    }
});

export default router;

