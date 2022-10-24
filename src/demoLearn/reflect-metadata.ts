import 'reflect-metadata';
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
    console.log('uuu---:', target, target.prototype);
    for(let key in target.prototype) {
        const data = Reflect.getMetadata('data', target.prototype, key);
        console.log('data===:', key, data);
    }
}
@showData
class Test002 {
    @Reflect.metadata('data', 'name')
    getName() {}

    @Reflect.metadata('data', 'age')
    getAge() {}
}
