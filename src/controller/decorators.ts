import 'reflect-metadata';
import {Router} from 'express';
import {getRealOwnPropertyNames} from '../utils/getRealOwnPropertyNames';

// 这里的路由已经包含了不同的路径处理
export const router = Router();

// 定义枚举类型，表明方法只能是get或者post，否者下面的method推断是any，传给router就会报错
enum Method {
    get = 'get',
    post = 'post'
}

// 通过传入的类型，生成不同请求方式的装饰器
const getRequestDecorator = (methodType: string) => {
    // 用于接收router的path路径
    return (path: string) => {
         // 返回装饰器
        return function(target: any, key: string) {
            Reflect.defineMetadata('path', path, target, key); // 也即是将‘/’的路径绑定到home方法上。
            Reflect.defineMetadata('method', methodType, target, key);
        }
    }
}

export const get = getRequestDecorator('get');
export const post = getRequestDecorator('post');

export const controller = (target: any) => {
    for(let key of getRealOwnPropertyNames(target)) {
        const pathData = Reflect.getMetadata('path', target.prototype, key);
        const method: Method = Reflect.getMetadata('method', target.prototype, key);
        const handle = target.prototype[key];
        // 这里借助遍历生成相应的路由，并对应关联的路由回调处理
        if(pathData && method && handle) {
            // 获取到绑定到路由方法上的请求类型，生成相应请求方法的路由
            router[method](pathData, handle);
        }
    }
}