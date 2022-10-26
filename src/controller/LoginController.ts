import 'reflect-metadata';
import {Request, Response} from 'express';
import {isLogin} from '../utils/util';
import {controller, get} from './decorators';

// 可以通过面向对象进行改造：将路径通过装饰器绑定到相应的执行函数上
@controller
class LoginController {
    @get('/')
    home(req: Request, res: Response) {
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
    }
}

export default LoginController;