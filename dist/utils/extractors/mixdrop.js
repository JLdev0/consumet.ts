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
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const models_1 = require("../../models");
class MixDrop extends models_1.VideoExtractor {
    constructor() {
        super(...arguments);
        this.serverName = 'MixDrop';
        this.sources = [];
        this.extract = (videoUrl) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(videoUrl.href);
                const match = (0, cheerio_1.load)(data)
                    .html()
                    .match(/(?<=p}\().*(?<=wurl).*\}/g);
                if (!match) {
                    throw new Error('Video not found.');
                }
                const [p, a, c, k, e, d] = match[0].split(',').map(x => x.split('.sp')[0]);
                const formated = this.format(p, a, c, k, e, JSON.parse(d));
                const [poster, source] = formated
                    .match(/(?<=poster'=").+?(?=")|(?<=wurl=").+?(?=")/g)
                    .map((x) => (x.startsWith('http') ? x : `https:${x}`));
                this.sources.push({
                    url: source,
                    isM3U8: source.includes('.m3u8'),
                    poster: poster,
                });
                return this.sources;
            }
            catch (err) {
                throw new Error(err.message);
            }
        });
        this.format = (p, a, c, k, e, d) => {
            k = k.split('|');
            e = (c) => {
                return c.toString(36);
            };
            if (!''.replace(/^/, String)) {
                while (c--) {
                    d[c.toString(a)] = k[c] || c.toString(a);
                }
                k = [
                    (e) => {
                        return d[e];
                    },
                ];
                e = () => {
                    return '\\w+';
                };
                c = 1;
            }
            while (c--) {
                if (k[c]) {
                    p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
                }
            }
            return p;
        };
    }
}
exports.default = MixDrop;
//# sourceMappingURL=mixdrop.js.map