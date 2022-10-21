"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crowller_1 = __importDefault(require("./utils/crowller"));
const analyer_1 = __importDefault(require("./utils/analyer"));
const util_1 = require("./utils/util");
const responseStatus_1 = require("./config/responseStatus");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const logStatusCheckMiddleware = (req, res, next) => {
    if ((0, util_1.isLogin)(req)) {
        next();
    }
    else {
        res.send('请先登录');
    }
};
router.get('/', (req, res) => {
    if ((0, util_1.isLogin)(req)) {
        res.send(`
            <html>
                <body>
                    <a href='./getData'>爬取数据</a>
                    <a href='./showData'>展示内容</a>
                    <a href='./logout'>退出</a>
                </body>
            </html>
        `);
    }
    else {
        res.send(`
            <html>
                <body>
                    <form method="post" action="/login">
                        <input type="password" name="password"/>
                        <button>登录</button>
                    </form>
                </body>
            </html>
        `);
    }
});
router.post('/login', (req, res) => {
    const { password } = req.body;
    if ((0, util_1.isLogin)(req)) {
        res.json((0, util_1.formatResponse)({}, responseStatus_1.RES_STATUS.HAD_LOGIN));
    }
    else {
        if (password === '123' && req.session) {
            req.session.loginStatus = true;
            res.json((0, util_1.formatResponse)({}, responseStatus_1.RES_STATUS.SUCCESS));
        }
        else {
            res.json((0, util_1.formatResponse)({}, responseStatus_1.RES_STATUS.FAIL, '登录失败'));
        }
    }
});
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.loginStatus = false;
    }
    ;
    res.redirect('/');
});
router.get('/getData', logStatusCheckMiddleware, (req, res) => {
    const key = 'x3b174jsx';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${key}`;
    const analyer = analyer_1.default.getInstance();
    new crowller_1.default(analyer, url);
    res.json((0, util_1.formatResponse)({}, responseStatus_1.RES_STATUS.SUCCESS, ''));
});
router.get('/showData', logStatusCheckMiddleware, (req, res) => {
    try {
        const dataPath = path_1.default.resolve(__dirname, '../data/course.json');
        const courseData = fs_1.default.readFileSync(dataPath, 'utf-8');
        res.json((0, util_1.formatResponse)(JSON.parse(courseData), responseStatus_1.RES_STATUS.SUCCESS));
    }
    catch (_a) {
        res.json((0, util_1.formatResponse)({}, responseStatus_1.RES_STATUS.OTHER, '暂获取不到数据'));
    }
});
exports.default = router;
