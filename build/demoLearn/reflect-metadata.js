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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const getRealOwnPropertyNames_1 = require("../utils/getRealOwnPropertyNames");
const user = {
    name: 'sun'
};
Reflect.defineMetadata('data', 'test', user);
console.log(Reflect.getMetadata('data', user));
class Test001 {
    getName() { }
}
__decorate([
    Reflect.metadata('data', 'test001'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Test001.prototype, "getName", null);
console.log(Reflect.getMetadata('data', Test001.prototype, 'getName'));
function showData(target) {
    for (let key of (0, getRealOwnPropertyNames_1.getRealOwnPropertyNames)(target)) {
        const data = Reflect.getMetadata('data', target.prototype, key);
        console.log('data===:', data);
    }
}
function setData(metakey, metavalue) {
    return function (target, key) {
        Reflect.defineMetadata(metakey, metavalue, target, key);
    };
}
let Test002 = class Test002 {
    getName() { }
    getAge() { }
};
__decorate([
    Reflect.metadata('data', 'name'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Test002.prototype, "getName", null);
__decorate([
    setData('data', 'age'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Test002.prototype, "getAge", null);
Test002 = __decorate([
    showData
], Test002);
