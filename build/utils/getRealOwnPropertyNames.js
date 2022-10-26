"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealOwnPropertyNames = void 0;
const getRealOwnPropertyNames = (classTarget) => {
    const classPropertyNames = Object.getOwnPropertyNames(classTarget.prototype);
    const realOwnPropertyNames = classPropertyNames.filter((itemName) => itemName !== 'constructor');
    console.log('realOwnPropertyNames--', classTarget, classPropertyNames, realOwnPropertyNames);
    return realOwnPropertyNames;
};
exports.getRealOwnPropertyNames = getRealOwnPropertyNames;
