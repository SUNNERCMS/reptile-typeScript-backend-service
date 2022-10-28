import 'reflect-metadata';
import { RequestHandler } from 'express';
import router from '../router';
import {getRealOwnPropertyNames} from '../utils/getRealOwnPropertyNames';
import {Methods} from '../config/typezhujie';

// target类型是构造函数, 类型注解：new (...args: any[]) => any
export const controller = (target: new (...args: any[]) => any) => {
    for(let key of getRealOwnPropertyNames(target)) {
        const pathData: string = Reflect.getMetadata('path', target.prototype, key);
        const method: Methods = Reflect.getMetadata('method', target.prototype, key);
        const middleware: RequestHandler = Reflect.getMetadata('middleware', target.prototype, key);
        const handle = target.prototype[key];
        // 这里借助遍历生成相应的路由，并对应关联的路由回调处理
        if(pathData && method) {
            // 获取到绑定到路由方法上的请求类型，生成相应请求方法的路由
            if(middleware) {
                router[method](pathData, middleware, handle);
            } else {
                router[method](pathData, handle);
            }
        }
    }
}