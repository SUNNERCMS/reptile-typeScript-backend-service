import {RequestWithBody} from './router';

export const isLogin = (req: RequestWithBody): boolean => {
    const isLogin = req.session ? req.session.loginStatus : false;
    return isLogin;
}