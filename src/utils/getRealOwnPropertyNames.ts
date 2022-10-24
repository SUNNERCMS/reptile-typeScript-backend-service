// 类的类型注解
interface ClassWithConstructor {
    new (str: string): void;
}

// 获取类本身定义的属性或者方法名称，不包括constructor
// https://juejin.cn/post/6844903875904798734
// class定义的方法是不可通过枚举的，可通过下面的方式验证
// Object.getOwnPropertyDescriptor(classProto, 'testMethod') 
// // {value: ƒ, writable: true, enumerable: false, configurable: true}
export const getRealOwnPropertyNames = (classTarget: ClassWithConstructor): string[] => {
    const classPropertyNames = Object.getOwnPropertyNames(classTarget.prototype);
    const realOwnPropertyNames =  classPropertyNames.filter((itemName: string) => itemName !== 'constructor');
    console.log('realOwnPropertyNames--', classTarget, classPropertyNames, realOwnPropertyNames);
    return realOwnPropertyNames;
}