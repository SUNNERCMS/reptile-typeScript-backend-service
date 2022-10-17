"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const fs_1 = __importDefault(require("fs"));
const analyer_1 = __importDefault(require("./analyer"));
const path_1 = __importDefault(require("path"));
class Crowller {
    constructor(analyer, url) {
        this.analyer = analyer;
        this.url = url;
        this.filePath = path_1.default.resolve(__dirname, '../data/course.json');
        this.initSpiderProcess();
    }
    getRowHtml() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield superagent_1.default.get(this.url);
            return data.text;
        });
    }
    initSpiderProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            const html = yield this.getRowHtml();
            const storeData = this.analyer.analyer(html, this.filePath);
            fs_1.default.writeFileSync(this.filePath, storeData);
        });
    }
}
const key = 'x3b174jsx';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${key}`;
const analyer = analyer_1.default.getInstance();
new Crowller(analyer, url);