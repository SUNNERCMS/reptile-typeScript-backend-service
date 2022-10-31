import 'reflect-metadata';
import {Request, Response} from 'express';
import {isLogin, formatResponse} from '../utils/util';
import {controller, get, post} from '../decorators/index';
import {RES_STATUS} from '../config/responseStatus';

export interface RequestWithBody extends Request{
    body: {
        [key: string]: string | undefined
    }
}
// 可以通过面向对象进行改造：将路径通过装饰器绑定到相应的执行函数上
@controller
class LoginController {
    @get('/')
    home(req: Request, res: Response):void {
        if(isLogin(req)) {
            res.send(`
                <html>
                    <body>
                        <a href='./api/getData'>爬取数据</a>
                        <a href='./api/showData'>展示内容</a>
                        <a href='./api/logout'>退出</a>
                    </body>
                </html>
            `);
        } else {
            res.send(`
                <html>
                    <body>
                        <form method="post" action="/api/login">
                            <input type="password" name="password"/>
                            <button>登录</button>
                        </form>
                    </body>
                </html>
            `);
        }
    };

    @get('/api/isLogin')
    isLoginCheck(req: RequestWithBody, res: Response):void {
        console.log('/api/isLogin');
        const isLoginStatus = isLogin(req);
        const resPonseStatus = isLoginStatus ? RES_STATUS.SUCCESS : RES_STATUS.HAD_LOGIN;
        const response = formatResponse<ResponseResult.isLoginCheck>(isLoginStatus, resPonseStatus);
        res.json(response);
    };

    @get('/api/logout')
    logout(req: RequestWithBody, res: Response):void {
        if(req.session) {
            req.session.loginStatus = false;
            // 成功退出
            res.json(formatResponse<ResponseResult.logout>(true, RES_STATUS.SUCCESS));
        };
        // 退出登录之后，回到根路径页面
        res.redirect('/');
    };

    @post('/api/login')
    login(req: RequestWithBody, res: Response):void {
        // body需要用body-parse中间件进行解析，保证始终有body字段
        const {password} = req.body;
        if(isLogin(req)) {
            res.json(formatResponse({}, RES_STATUS.HAD_LOGIN));
        } else {
            if(password === '123' && req.session) {
                req.session.loginStatus = true;
                res.json(formatResponse<ResponseResult.login>({}, RES_STATUS.SUCCESS));
            } else {
                res.json(formatResponse<ResponseResult.login>({}, RES_STATUS.FAIL, '密码不正确'));
            }
        }
    };
}

export default LoginController;