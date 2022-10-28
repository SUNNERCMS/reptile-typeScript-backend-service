import 'reflect-metadata';

// 中间件装饰器
export const useMiddleware = (middleware: Function) => {
    // 返回装饰器
    return function(target: any, key: string) {
        Reflect.defineMetadata('middleware', middleware, target, key); 
    }
}
