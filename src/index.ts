import express, {Request, Response, NextFunction} from 'express';
import {router} from './controller/decorators';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
// 引入控制器，完成类的编译执行，生成相应的路径控制
import './controller/LoginController';

const app = express();
const bodyParseMiddleware = bodyParser.urlencoded({ extended: false });

app.use(cookieSession({
    name: 'session',
    keys: ['key01'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use((req: Request, res: Response, next: NextFunction) => {
    req.customProperty = 'sunnercms';
    next();
});

app.use(bodyParseMiddleware, router);

app.listen(7001, () => {
    console.log('server is running');
});