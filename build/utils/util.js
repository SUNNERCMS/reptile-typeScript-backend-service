"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponse = exports.isLogin = void 0;
const isLogin = (req) => {
    const isLogin = req.session ? req.session.loginStatus : false;
    return isLogin;
};
exports.isLogin = isLogin;
const formatResponse = (data, status, errMeg) => {
    return {
        status,
        errMeg,
        data
    };
};
exports.formatResponse = formatResponse;
