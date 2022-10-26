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
const util_1 = require("../utils/util");
const decorators_1 = require("./decorators");
let LoginController = class LoginController {
    home(req, res) {
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
    }
};
__decorate([
    (0, decorators_1.get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "home", null);
LoginController = __decorate([
    decorators_1.controller
], LoginController);
exports.default = LoginController;
