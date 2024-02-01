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
var router = express_1.default.Router();
var allStatus = ['all', 'completed', 'ongoing'];
// Genres
router.get('/genres', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = res).send;
                return [4 /*yield*/, _1.Comics.getGenres()];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
router.get('/genres/:slug', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, query, slug, page, status, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                params = req.params, query = req.query;
                slug = params.slug;
                page = query.page ? Number(query.page) : 1;
                status = query.status ? query.status : 'all';
                //@ts-ignore
                if (!allStatus.includes(status))
                    throw Error('Invalid status');
                //@ts-ignore
                _b = (_a = res).send;
                return [4 /*yield*/, _1.Comics.getComicsByGenre(slug, page, status)];
            case 1:
                //@ts-ignore
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
// New Comics
router.get("/new-comics", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, status, page, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                query = req.query;
                status = query.status ? query.status : 'all';
                page = query.page ? Number(query.page) : 1;
                //@ts-ignore
                if (!allStatus.includes(status))
                    throw Error('Invalid status');
                // @ts-ignore
                _b = (_a = res).json;
                return [4 /*yield*/, _1.Comics.getNewComics(status, page)];
            case 1:
                // @ts-ignore
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
// Recommend Comics
router.get("/recommend-comics", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, type, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                query = req.query;
                type = query.type ? query.type : 'hot';
                // @ts-ignore
                _b = (_a = res).json;
                return [4 /*yield*/, _1.Comics.getRecommendComics(type)];
            case 1:
                // @ts-ignore
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
    router.get(path, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var query, q, page, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    query = req.query;
                    q = query.q ? query.q : '';
                    if (!q)
                        throw Error('Invalid query');
                    page = query.page ? Number(query.page) : 1;
                    //@ts-ignore
                    _b = (_a = res).send;
                    return [4 /*yield*/, callback(q, page)];
                case 1:
                    //@ts-ignore
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    }); });
});
// Page params
var pageParamsApiPaths = [
    {
        path: '/boy-comics',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getBoyComics.apply(_1.Comics, params);
        },
    },
    {
        path: '/completed-comics',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getCompletedComics.apply(_1.Comics, params);
        },
    },
    {
        path: '/girl-comics',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getGirlComics.apply(_1.Comics, params);
        },
    },
    {
        path: '/recent-update-comics',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getRecentUpdateComics.apply(_1.Comics, params);
        },
    },
    {
        path: '/trending-comics',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getTrendingComics.apply(_1.Comics, params);
        },
    },
];
pageParamsApiPaths.forEach(function (_a) {
    var path = _a.path, callback = _a.callback;
    router.get(path, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var query, page, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    query = req.query;
                    page = query.page ? Number(query.page) : 1;
                    _b = (_a = res).json;
                    return [4 /*yield*/, callback(page)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
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
    {
        path: '/comics/authors/:slug',
        callback: function (params) { return _1.Comics.getComicsByAuthor(params); },
    },
];
comicIdParamsApiPaths.forEach(function (_a) {
    var path = _a.path, callback = _a.callback;
    router.get(path, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var params, slug, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    params = req.params;
                    slug = params.slug;
                    if (!slug)
                        throw Error('Invalid');
                    _b = (_a = res).json;
                    return [4 /*yield*/, callback(slug)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
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
router.get('/comics/:slug/comments', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, query, slug, page, chapter, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                params = req.params, query = req.query;
                slug = params.slug;
                page = query.page ? Number(query.page) : 1;
                chapter = query.chapter ? Number(query.chapter) : -1;
                // @ts-ignore
                if (!slug)
                    throw Error('Invalid Comic ID');
                _b = (_a = res).json;
                return [4 /*yield*/, _1.Comics.getComments(slug, page, chapter)];
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
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getTopAllComics.apply(_1.Comics, params);
        },
    },
    {
        path: '/weekly',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getTopWeeklyComics.apply(_1.Comics, params);
        },
    },
    {
        path: '/monthly',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getTopMonthlyComics.apply(_1.Comics, params);
        },
    },
    {
        path: '/daily',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getTopDailyComics.apply(_1.Comics, params);
        },
    },
    {
        path: '/chapter',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getTopChapterComics.apply(_1.Comics, params);
        },
    },
    {
        path: '/follow',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getTopFollowComics.apply(_1.Comics, params);
        },
    },
    {
        path: '/comment',
        callback: function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            return _1.Comics.getTopCommentComics.apply(_1.Comics, params);
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
router.get('/images', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var src, response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                src = req.query.src;
                return [4 /*yield*/, axios_1.default.get(src, {
                        responseType: 'stream',
                        headers: {
                            referer: 'https://www.nettruyen.com',
                            'User-Agent': random_useragent_1.default.getRandom(),
                        },
                    })];
            case 1:
                response = _a.sent();
                response.data.pipe(res);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                throw err_1;
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
