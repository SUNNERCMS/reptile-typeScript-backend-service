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
// const testDecorator01 = () => <T extends new (...args: any[]) => {}>(constructor: T) => {
//     return class extends constructor {
//         name = "girl";
//         getName() {
//             return this.name;
//         }
//     }
// }
   
// const classNew = testDecorator01()(class Test {
//     name: string;
//     constructor(name: string) {
//         this.name = name;
//     }
// });
// const test = new classNew('boy');
// // console.log(test); // Test { name: 'girl' }, 先执行实例化类时的boy，最后由装饰器进行了属性覆盖。
// console.log('res:', test.getName()); // res: girl


// 类中方法的装饰器
// 1、对类中方法的装饰，执行时机也是类定义完成之后，而非必要要将类实例化。
// 2、类方法装饰器的参数：
//（1）target:普通方法，对应的是类的prototype。静态方法，对应的是类的构造函数。
//（2）key: 所修饰的类方法的名称。
// (3) descriptor: PropertyDecorator, 可以针对类的函数做一些配置，如是否是可获取get，可写writable，可遍历enumerable;
// function getNameDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
//     descriptor.writable = false;
// };
// class Test {
//     name:string;
//     constructor(name: string) {
//         this.name = name;
//     }
//     @getNameDecorator
//     getName() {
//         return this.name;
//     }
// }
// const test = new Test('sun');
// console.log(test.getName()); //---> sun
// test.getName = () => '123'; // ---> '123', 会执行实例重写的类方法，进行方法的覆盖。descriptor.writable = false; 装饰之后会报错提示，不能进行类方法的复写。


// // descriptor.value: 表示当前所装饰方法的值，这里descriptor.value表示的是getName这个方法。
// function getNameDecorator01(target: any, key: string, descriptor: PropertyDescriptor) {
//     descriptor.value = function() {
//         return 'decorator'
//     };
// };
// class Test01 {
//     name:string;
//     constructor(name: string) {
//         this.name = name;
//     }
//     @getNameDecorator01
//     getName01() {
//         return this.name;
//     }
// }
// const test01 = new Test01('sun');
// console.log(test01.getName01()); //---> decorator


// 访问器装饰器，setter和getter不能同时设置。
function getNameDecorator03(target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = false;
};
class Test03 {
    private _name: string;
    constructor(name: string) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    @getNameDecorator03
    set name(name: string) {
        this._name = name;
    }
}
const test03 = new Test03('sun');
test03.name = '12445';
console.log('03---', test03.name); //---> decorator


// 属性装饰器
// 1、第一个参数。如果装饰的是静态方法，则是这个类 Target 本身；如果装饰的是原型方法，则是类的原型对象 Target.prototype
// 2、第二个参数。这个属性的名称
function nameDecorator(target: any, key: string) {
    // 装饰器接收的target是原型对象
    target[key] = 'hahahh';
};
class Test04 {
   @nameDecorator
   name = 'Test04';
}
const test04 = new Test04();
console.log('04---', test04.name); //---> Test04
console.log('04---04', (test04 as any).__proto__.name); //---> hahahh

// 属性装饰器，只有两个参数，没有属性描述符，可以让装饰器返回descriptor，进行属性描述符的配置。
function nameDecorator01(target: any, key: string): any {
    const descriptor: PropertyDescriptor = {
        writable: true
    }
    return descriptor;
};
class Test05 {
   @nameDecorator01
   name = 'Test05';
}
const test05 = new Test05();
test05.name = 'yyy'; // Cannot assign to read only property 'name' of object '#<Test05>', writable: true,可设置该属性可写，输出test05---: yyy
console.log('test05---:', test05.name);

// 参数装饰器
// 1、第一个参数。如果装饰的是静态方法的参数，则是这个类Target本身；如果装饰的是原型方法的参数，则是类的原型对象Target.prototype
// 2、第二个参数。参数所处的函数名称
// 3、第三个参数，该参数位于函数参数列表的位置下标(number)
// 不能在箭头函数中的参数填加参数装饰器
function getPersonParamDecorator(target: any, key: string, paramIndex: number): any {
    console.log('getPersonParamDecorator', target, key, paramIndex); //
};
class Test06 {
   getPerson(name: string, @getPersonParamDecorator age: number) {
        console.log(name, age);
   }
}
const test06 = new Test06();
test06.getPerson('sun', 18);

// 装饰器应用场景demo: 提取类中方法的公共处理部分
const userInfo: any = undefined;
function catchError(target: any, key: string, descriptor: PropertyDescriptor) {
    const fn = descriptor.value; // 装饰的函数
    descriptor.value = function(...args: any) {
        try{
            fn.apply(this, args);
        } catch(e) {
            console.log('useInfo 数据有问题');
        }
    }
}
class Test07 {
    @catchError
    getName(name: string) {
        console.log('name', name);
        return userInfo.name();
    }
    @catchError
    getAge() {
        return userInfo.age();
    }
}
const test07 = new Test07();
test07.getName('sun');