"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLogin = void 0;
const isLogin = (req) => {
    const isLogin = req.session ? req.session.loginStatus : false;
    return isLogin;
};
exports.isLogin = isLogin;
