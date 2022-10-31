import {RequestWithBody} from '../controller/CrowllerController';

interface Result<T>{
    status: number,
    errMeg?: string,
    data: T
}

export const isLogin = (req: RequestWithBody): boolean => {
    const isLogin = req.session ? req.session.loginStatus : false;
    return isLogin;
}

// 格式化接口数据结构
export const formatResponse = <T>(data: T, status: number, errMeg?: string): Result<T> => {
    return {
        status,
        errMeg,
        data
    }
}