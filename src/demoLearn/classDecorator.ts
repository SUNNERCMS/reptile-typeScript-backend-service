// 类的装饰器
// 装饰器本身是一个函数，通过@符号来使用


// function testDecorator01(constructor: any) {
//     console.log('demo01');
// }
// function testDecorator02(constructor: any) {
//     console.log('demo02');
// }
// @testDecorator01
// @testDecorator02
// class Test {};


// // 通过接收的类构造函数，进行属性或者方法的扩展， 装饰器也可以使用箭头函数。
// function testDecorator01(constructor: any) {
//     constructor.prototype.getName = () => {
//         console.log('demo01');
//     }
// }
// // 装饰器也可以使用箭头函数。
// const testDecorator01 = (constructor: any) => {
//     constructor.prototype.getName = () => {
//         console.log('demo001');
//     }
// }
// @testDecorator01
// class Test {};
// const test = new Test();
// (test as any).getName();


// // 通过工厂模式，使装饰器接收额外指定的参数, 扩展装饰器内部逻辑处理
// function testDecorator01(isTrue: boolean) {
//     if(isTrue) {
//         return (constructor: any) => {
//             constructor.prototype.getName = () => {
//                 console.log('demo03');
//             }
//         }
//     } else {
//         return () => {}
//     }
// }
// @testDecorator01(true)
// class Test {};
// const test = new Test();
// (test as any).getName();


// //  new (...args: any[]) => {} 表示这个是一个构造函数，该函数接收很多参数，每个函数都是any类型。
// const testDecorator01 = <T extends new (...args: any[]) => {}>(constructor: T) => {
//     return class extends constructor {
//         name = "girl";
//         getName() {
//             return this.name;
//         }
//     }
// }
   
// @testDecorator01
// class Test {
//     name: string;
//     constructor(name: string) {
//         this.name = name;
//     }
// };
// const test = new Test('boy');
// console.log(test); // Test { name: 'girl' }, 先执行实例化类时的boy，最后由装饰器进行了属性覆盖。
// test.getName();
// // Property 'getName' does not exist on type 'Test'
// // test是有类Test实例化得到的，由于Test类中没有getName这个方法，所有会保错，由于可见即便是装饰器扩展了该方法，ts也推断不到。
// // 处理上面拿不到getName方法的报错可以采用 const classNew=decorator(class)的形式进行类的装饰，然后进行类的实例new classNew，此时new出来的实例就会包含getNama的方法。

const testDecorator01 = () => <T extends new (...args: any[]) => {}>(constructor: T) => {
    return class extends constructor {
        name = "girl";
        getName() {
            return this.name;
        }
    }
}
   
const classNew = testDecorator01()(class Test {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
});
const test = new classNew('boy');
// console.log(test); // Test { name: 'girl' }, 先执行实例化类时的boy，最后由装饰器进行了属性覆盖。
console.log('res:', test.getName()); // res: girl
