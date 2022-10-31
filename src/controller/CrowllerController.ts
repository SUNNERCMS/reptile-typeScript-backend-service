import fs from 'fs';
import path from 'path';
import 'reflect-metadata';
import {Request, Response, NextFunction} from 'express';
import {isLogin, formatResponse} from '../utils/util';
import {controller, get, useMiddleware} from '../decorators/index';
import {RES_STATUS} from '../config/responseStatus';
import Crowller from '../utils/crowller';
import Analyer from '../utils/analyer';
export interface RequestWithBody extends Request{
    body: {
        [key: string]: string | undefined
    }
}

// 登录态的校验中间件
const logStatusCheckMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // 如果已经登录，接着执行后续回调
    if(isLogin(req)) {
        next();
    } else {
        res.send('请先登录')
    }
}

// 可以通过面向对象进行改造：将路径通过装饰器绑定到相应的执行函数上
@controller
class CrowllerController {
    @get('/api/getData')
    @useMiddleware(logStatusCheckMiddleware)
    getData(req: Request, res: Response):void {
        // 创建爬虫类触发爬虫的数据获取
        // 网页key
        const key = 'x3b174jsx';
        const url = `http://www.dell-lee.com/typescript/demo.html?secret=${key}`;

        // 获取分析器实例
        const analyer = Analyer.getInstance();
        new Crowller(analyer, url);
        res.json(formatResponse<ResponseResult.getData>({}, RES_STATUS.SUCCESS, ''));
    };

    @get('/api/showData')
    @useMiddleware(logStatusCheckMiddleware)
    showData(req: RequestWithBody, res: Response):void {
         // 避免course.json文件没有创建报错
        try {
            const dataPath = path.resolve(__dirname, '../../data/course.json');
            const courseData = fs.readFileSync(dataPath, 'utf-8');
            const responseData = formatResponse<ResponseResult.showData>(JSON.parse(courseData), RES_STATUS.SUCCESS);
            res.json(responseData);
        } catch {
            res.json(formatResponse<ResponseResult.showData>({}, RES_STATUS.OTHER, '暂获取不到数据'));
        }
    };
}

export default CrowllerController;