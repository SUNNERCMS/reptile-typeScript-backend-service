"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = exports.get = void 0;
require("reflect-metadata");
const getRealOwnPropertyNames_1 = require("../utils/getRealOwnPropertyNames");
const get = (path) => {
    return function (target, key) {
        Reflect.defineMetadata('path', path, target, key);
    };
};
exports.get = get;
const controller = (target) => {
    for (let key of (0, getRealOwnPropertyNames_1.getRealOwnPropertyNames)(target)) {
        const data = Reflect.getMetadata('path', target.prototype, key);
        console.log('data===:', data);
    }
};
exports.controller = controller;
