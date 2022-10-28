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
    };

    @get('/logout')
    logout(req: RequestWithBody, res: Response):void {
        if(req.session) {
            req.session.loginStatus = false;
        };
        // 退出登录之后，回到根路径页面
        res.redirect('/');
    };

    @post('/login')
    login(req: RequestWithBody, res: Response):void {
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
    };
}

export default LoginController;