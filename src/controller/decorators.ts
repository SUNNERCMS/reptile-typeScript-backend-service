import 'reflect-metadata';
import {getRealOwnPropertyNames} from '../utils/getRealOwnPropertyNames';

export const get = (path: string) => {
    return function(target: any, key: string) {
        Reflect.defineMetadata('path', path, target, key); // 也即是将‘/’的路径绑定到home方法上。
    }
}

export const controller = (target: any) => {
    for(let key of getRealOwnPropertyNames(target)) {
        const data = Reflect.getMetadata('path', target.prototype, key);
        console.log('data===:', data); // name, age
    }
}