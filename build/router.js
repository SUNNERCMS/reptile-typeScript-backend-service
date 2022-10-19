"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crowller_1 = __importDefault(require("./crowller"));
const analyer_1 = __importDefault(require("./analyer"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send(`
        <html>
            <body>
                <form method="post" action="/demo">
                    <input type="password" name="password"/>
                    <button>提交</button>
                </form>
            </body>
        </html>
    `);
});
router.post('/demo', (req, res) => {
    if (req.body.password === '123') {
        const key = 'x3b174jsx';
        const url = `http://www.dell-lee.com/typescript/demo.html?secret=${key}`;
        const analyer = analyer_1.default.getInstance();
        new crowller_1.default(analyer, url);
        res.send('口令正确并爬取数据');
    }
    else {
        res.send('口令不对');
    }
});
exports.default = router;
