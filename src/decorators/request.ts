import 'reflect-metadata';
import {Methods} from '../config/typezhujie';

// 通过传入的类型，生成不同请求方式的装饰器
const getRequestDecorator = (methodType: Methods) => {
    // 用于接收router的path路径
    return (path: string) => {
         // 返回装饰器
        return function(target: any, key: string) {
            Reflect.defineMetadata('path', path, target, key); // 也即是将‘/’的路径绑定到home方法上。
            Reflect.defineMetadata('method', methodType, target, key);
        }
    }
}

export const get = getRequestDecorator(Methods.get);
export const post = getRequestDecorator(Methods.post);