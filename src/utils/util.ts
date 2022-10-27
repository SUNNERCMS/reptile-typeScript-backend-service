import {RequestWithBody} from '../controller/CrowllerController';

interface Result {
    status: number,
    errMeg?: string,
    data: any
}

export const isLogin = (req: RequestWithBody): boolean => {
    const isLogin = req.session ? req.session.loginStatus : false;
    return isLogin;
}

// 格式化接口数据结构
export const formatResponse = (data: any, status: number, errMeg?: string): Result => {
    return {
        status,
        errMeg,
        data
    }
}