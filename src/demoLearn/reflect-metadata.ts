import 'reflect-metadata';
import {getRealOwnPropertyNames} from '../utils/getRealOwnPropertyNames';
//[Metadata](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata) 
//[reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
const user = {
    name: 'sun'
};

// metadataKey, metadataValue, target
// 第一个参数：元数据的key
// 第二个参数：元数据的值value
// 第三个参数：元数据挂载的位置
Reflect.defineMetadata('data', 'test', user);
console.log(Reflect.getMetadata('data', user));


// 通过装饰器的形式应用在类时，使用@Reflect.metadata(metadataKey, metadataValue)
// get metadata value of a metadata key on the prototype chain of an object or property
// let result = Reflect.getMetadata(metadataKey, target);
// let result = Reflect.getMetadata(metadataKey, target, propertyKey);
class Test001 {
    @Reflect.metadata('data', 'test001')
    getName() { }
}
console.log(Reflect.getMetadata('data', Test001.prototype, 'getName'));


// 模拟@Reflect.metadata
function showData(target: typeof Test002) {
    for(let key of getRealOwnPropertyNames(target)) {
        const data = Reflect.getMetadata('data', target.prototype, key);
        console.log('data===:', data); // name, age
    }
}

// 作用相当于@Reflect.metadata的使用
function setData(metakey: string, metavalue: string) {
    return function(target: Test002, key:string) {
        Reflect.defineMetadata(metakey, metavalue, target, key);
    }
}
@showData
class Test002 {
    @Reflect.metadata('data', 'name')
    getName() {}

    @setData('data', 'age')
    getAge() {}
}
