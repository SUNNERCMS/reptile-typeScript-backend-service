"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
function getNameDecorator03(target, key, descriptor) {
    descriptor.configurable = false;
}
;
class Test03 {
    constructor(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
}
__decorate([
    getNameDecorator03,
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], Test03.prototype, "name", null);
const test03 = new Test03('sun');
test03.name = '12445';
console.log('03---', test03.name);
function nameDecorator(target, key) {
    target[key] = 'hahahh';
}
;
class Test04 {
    constructor() {
        this.name = 'Test04';
    }
}
__decorate([
    nameDecorator,
    __metadata("design:type", Object)
], Test04.prototype, "name", void 0);
const test04 = new Test04();
console.log('04---', test04.name);
console.log('04---04', test04.__proto__.name);
function nameDecorator01(target, key) {
    const descriptor = {
        writable: true
    };
    return descriptor;
}
;
class Test05 {
    constructor() {
        this.name = 'Test05';
    }
}
__decorate([
    nameDecorator01,
    __metadata("design:type", Object)
], Test05.prototype, "name", void 0);
const test05 = new Test05();
test05.name = 'yyy';
console.log('test05---:', test05.name);
function getPersonParamDecorator(target, key, paramIndex) {
    console.log('getPersonParamDecorator', target, key, paramIndex);
}
;
class Test06 {
    getPerson(name, age) {
        console.log(name, age);
    }
}
__decorate([
    __param(1, getPersonParamDecorator),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], Test06.prototype, "getPerson", null);
const test06 = new Test06();
test06.getPerson('sun', 18);
const userInfo = undefined;
function catchError(target, key, descriptor) {
    const fn = descriptor.value;
    descriptor.value = function (...args) {
        try {
            fn.apply(this, args);
        }
        catch (e) {
            console.log('useInfo 数据有问题');
        }
    };
}
class Test07 {
    getName(name) {
        console.log('name', name);
        return userInfo.name();
    }
    getAge() {
        return userInfo.age();
    }
}
__decorate([
    catchError,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Test07.prototype, "getName", null);
__decorate([
    catchError,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Test07.prototype, "getAge", null);
const test07 = new Test07();
test07.getName('sun');
