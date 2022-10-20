"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crowller_1 = __importDefault(require("./crowller"));
const analyer_1 = __importDefault(require("./analyer"));
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    if ((0, utils_1.isLogin)(req)) {
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
    if ((0, utils_1.isLogin)(req)) {
        res.send('已经登录过了');
    }
    else {
        if (password === '123' && req.session) {
            req.session.loginStatus = true;
            res.send('登录成功');
        }
        else {
            res.send('登录失败');
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
router.get('/getData', (req, res) => {
    if ((0, utils_1.isLogin)(req)) {
        const key = 'x3b174jsx';
        const url = `http://www.dell-lee.com/typescript/demo.html?secret=${key}`;
        const analyer = analyer_1.default.getInstance();
        new crowller_1.default(analyer, url);
        res.send('口令正确并爬取数据');
    }
    else {
        res.send(`${req.customProperty}-请登录后爬取数据`);
    }
});
router.get('/showData', (req, res) => {
    try {
        if ((0, utils_1.isLogin)(req)) {
            const dataPath = path_1.default.resolve(__dirname, '../data/course.json');
            const courseData = fs_1.default.readFileSync(dataPath, 'utf-8');
            res.send(JSON.parse(courseData));
        }
        else {
            res.send('请先登录');
        }
    }
    catch (_a) {
        res.send('暂时爬取不到内容');
    }
});
exports.default = router;
