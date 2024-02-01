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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var axios_1 = require("axios");
var _1 = require(".");
var random_useragent_1 = require("random-useragent");
var allStatus = ['all', 'completed', 'ongoing'];
var router = express_1.default.Router();
// Genres
router.get('/genres', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).json;
                return [4 /*yield*/, _1.Comics.getGenres()];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
router.get('/genres/:slug', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var params, query, slug, page, status_1, _a, _b, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                params = req.params, query = req.query;
                slug = params.slug;
                page = query.page ? Number(query.page) : 1;
                status_1 = query.status ? "".concat(query.status) : 'all';
                if (!allStatus.includes(status_1))
                    throw Error('Invalid status');
                _b = (_a = res).json;
                return [4 /*yield*/, _1.Comics.getComicsByGenre(slug, page, status_1)];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _c.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Page params
var statusPaths = [
    {
        path: '/new-comics',
        callback: function (page, status) {
            return _1.Comics.getNewComics(page, status);
        },
    },
    {
        path: '/recent-update-comics',
        callback: function (page, status) {
            return _1.Comics.getRecentUpdateComics(page, status);
        },
    },
];
statusPaths.forEach(function (_a) {
    var path = _a.path, callback = _a.callback;
    router.get(path, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var query, status_2, page, _a, _b, err_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    query = req.query;
                    status_2 = query.status ? "".concat(query.status) : 'all';
                    page = query.page ? Number(query.page) : 1;
                    if (!allStatus.includes(status_2))
                        throw Error('Invalid status');
                    _b = (_a = res).json;
                    return [4 /*yield*/, callback(page, status_2)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _c.sent();
                    next(err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
});
// Recommend Comics
router.get("/recommend-comics", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).json;
                return [4 /*yield*/, _1.Comics.getRecommendComics()];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
// Search
var searchApiPaths = [
    {
        path: '/search',
        callback: function (q, page) { return _1.Comics.searchComics(q, page); },
    },
    {
        path: '/search-suggest',
        callback: function (q) { return _1.Comics.getSearchSuggest(q); },
    },
];
searchApiPaths.forEach(function (_a) {
    var path = _a.path, callback = _a.callback;
    router.get(path, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var query, q, page, _a, _b, err_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    query = req.query;
                    q = query.q ? "".concat(query.q) : '';
                    if (!q)
                        throw Error('Invalid query');
                    page = query.page ? Number(query.page) : 1;
                    _b = (_a = res).json;
                    return [4 /*yield*/, callback(q, page)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _c.sent();
                    next(err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
});
// Page params
var pageParamsApiPaths = [
    {
        path: '/boy-comics',
        callback: function (page) { return _1.Comics.getBoyComics(page); },
    },
    {
        path: '/completed-comics',
        callback: function (page) { return _1.Comics.getCompletedComics(page); },
    },
    {
        path: '/girl-comics',
        callback: function (page) { return _1.Comics.getGirlComics(page); },
    },
    {
        path: '/trending-comics',
        callback: function (page) { return _1.Comics.getTrendingComics(page); },
    },
];
pageParamsApiPaths.forEach(function (_a) {
    var path = _a.path, callback = _a.callback;
    router.get(path, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var query, page, _a, _b, err_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    query = req.query;
                    page = query.page ? Number(query.page) : 1;
                    _b = (_a = res).json;
                    return [4 /*yield*/, callback(page)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _c.sent();
                    next(err_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
});
// Comics
var comicIdParamsApiPaths = [
    {
        path: '/comics/:slug/chapters',
        callback: function (params) { return _1.Comics.getChapters(params); },
    },
    {
        path: '/comics/:slug',
        callback: function (params) { return _1.Comics.getComicDetail(params); },
    },
];
comicIdParamsApiPaths.forEach(function (_a) {
    var path = _a.path, callback = _a.callback;
    router.get(path, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var params, slug, _a, _b, err_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    params = req.params;
                    slug = params.slug;
                    if (!slug)
                        throw Error('Invalid');
                    _b = (_a = res).json;
                    return [4 /*yield*/, callback(slug)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    err_5 = _c.sent();
                    next(err_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
});
router.get('/comics/:slug/chapters/:chapter_id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, slug, chapter_id, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                params = req.params;
                slug = params.slug;
                chapter_id = params.chapter_id ? Number(params.chapter_id) : null;
                if (!slug || !chapter_id)
                    throw Error('Invalid');
                _b = (_a = res).json;
                return [4 /*yield*/, _1.Comics.getChapter(slug, chapter_id)];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
// Top Comics
var topComicsApiPaths = [
    {
        path: '/',
        callback: function (status, page) {
            return _1.Comics.getTopAllComics(status, page);
        },
    },
    {
        path: '/weekly',
        callback: function (status, page) {
            return _1.Comics.getTopWeeklyComics(status, page);
        },
    },
    {
        path: '/monthly',
        callback: function (status, page) {
            return _1.Comics.getTopMonthlyComics(status, page);
        },
    },
    {
        path: '/daily',
        callback: function (status, page) {
            return _1.Comics.getTopDailyComics(status, page);
        },
    },
    {
        path: '/chapter',
        callback: function (status, page) {
            return _1.Comics.getTopChapterComics(status, page);
        },
    },
    {
        path: '/follow',
        callback: function (status, page) {
            return _1.Comics.getTopFollowComics(status, page);
        },
    },
    {
        path: '/comment',
        callback: function (status, page) {
            return _1.Comics.getTopCommentComics(status, page);
        },
    },
];
topComicsApiPaths.forEach(function (_a) {
    var path = _a.path, callback = _a.callback;
    router.get("/top".concat(path), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var query, status, page, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    query = req.query;
                    status = query.status ? query.status : 'all';
                    page = query.page ? Number(query.page) : 1;
                    _b = (_a = res).json;
                    return [4 /*yield*/, callback(status, page)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
});
router.get('/images', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var src, providers, response, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                src = req.query.src;
                if (!src)
                    throw new Error('Invalid image source');
                providers = ['nettruyennew.com', 'truyenqq.com.vn', 'nettruyenco.vn'];
                return [4 /*yield*/, axios_1.default.get("".concat(src), {
                        responseType: 'stream',
                        headers: {
                            referer: "https://".concat(providers[Math.floor(Math.random() * 3)]),
                            'User-Agent': random_useragent_1.default.getRandom(),
                        },
                    })];
            case 1:
                response = _a.sent();
                response.data.pipe(res);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                next(err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
