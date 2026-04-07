"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const _1 = require(".");
const userAgent = __importStar(require("random-useragent"));
console.log('v2 API router loaded');
const router = express_1.default.Router();
const allStatus = ['all', 'completed', 'ongoing'];
// Async handler wrapper to catch errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// Genres
router.get('/genres', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield _1.Comics.getGenres();
    res.json(data);
})));
router.get('/genres/:slug', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params, query } = req;
    const slug = String(params.slug || '');
    const page = Number(query.page) || 1;
    const status = String(query.status || 'all');
    if (!allStatus.includes(status)) {
        return res.status(400).json({ status: 400, message: 'Invalid status' });
    }
    const data = yield _1.Comics.getComicsByGenre(slug, page, status);
    res.json(data);
})));
// New Comics
router.get(`/new-comics`, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const status = query.status || 'all';
    const page = Number(query.page) || 1;
    if (!allStatus.includes(status)) {
        return res.status(400).json({ status: 400, message: 'Invalid status' });
    }
    const data = yield _1.Comics.getNewComics(status, page);
    res.json(data);
})));
// Recommend Comics
router.get(`/recommend-comics`, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const type = query.type || 'hot';
    const data = yield _1.Comics.getRecommendComics(type);
    res.json(data);
})));
// Search
const searchApiPaths = [
    {
        path: '/search',
        callback: (q, page) => _1.Comics.searchComics(q, page),
    },
    {
        path: '/search-suggest',
        callback: (q) => _1.Comics.getSearchSuggest(q),
    },
];
searchApiPaths.forEach(({ path, callback }) => {
    router.get(path, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = req;
        const q = String(query.q || '');
        if (!q) {
            return res.status(400).json({ status: 400, message: 'Invalid query' });
        }
        const page = Number(query.page) || 1;
        const data = yield callback(q, page);
        res.json(data);
    })));
});
// Page params
const pageParamsApiPaths = [
    {
        path: '/boy-comics',
        callback: (...params) => _1.Comics.getBoyComics(...params),
    },
    {
        path: '/completed-comics',
        callback: (...params) => _1.Comics.getCompletedComics(...params),
    },
    {
        path: '/girl-comics',
        callback: (...params) => _1.Comics.getGirlComics(...params),
    },
    {
        path: '/recent-update-comics',
        callback: (...params) => _1.Comics.getRecentUpdateComics(...params),
    },
    {
        path: '/trending-comics',
        callback: (...params) => _1.Comics.getTrendingComics(...params),
    },
];
pageParamsApiPaths.forEach(({ path, callback }) => {
    router.get(path, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = req;
        const page = Number(query.page) || 1;
        const data = yield callback(page);
        res.json(data);
    })));
});
// Comics
const comicIdParamsApiPaths = [
    {
        path: '/comics/:slug/chapters',
        callback: (params) => _1.Comics.getChapters(params),
    },
    {
        path: '/comics/:slug',
        callback: (params) => _1.Comics.getComicDetail(params),
    },
    {
        path: '/comics/authors/:slug',
        callback: (params) => _1.Comics.getComicsByAuthor(params),
    },
];
comicIdParamsApiPaths.forEach(({ path, callback }) => {
    router.get(path, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { params } = req;
        const slug = String(params.slug || '');
        if (!slug) {
            return res.status(400).json({ status: 400, message: 'Invalid slug' });
        }
        const data = yield callback(slug);
        res.json(data);
    })));
});
router.get('/comics/:slug/chapters/:chapter_id', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params } = req;
    const slug = String(params.slug || '');
    const chapter_id = params.chapter_id ? Number(params.chapter_id) : null;
    if (!slug || !chapter_id) {
        return res.status(400).json({ status: 400, message: 'Invalid parameters' });
    }
    const data = yield _1.Comics.getChapter(slug, chapter_id);
    res.json(data);
})));
router.get('/comics/:slug/comments', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params, query } = req;
    const slug = String(params.slug || '');
    const page = Number(query.page) || 1;
    if (!slug) {
        return res.status(400).json({ status: 400, message: 'Invalid slug' });
    }
    const data = yield _1.Comics.getComments(slug, page);
    res.json(data);
})));
// Top Comics
const topComicsApiPaths = [
    {
        path: '/',
        callback: (...params) => _1.Comics.getTopAllComics(...params),
    },
    {
        path: '/weekly',
        callback: (...params) => _1.Comics.getTopWeeklyComics(...params),
    },
    {
        path: '/monthly',
        callback: (...params) => _1.Comics.getTopMonthlyComics(...params),
    },
    {
        path: '/daily',
        callback: (...params) => _1.Comics.getTopDailyComics(...params),
    },
    {
        path: '/chapter',
        callback: (...params) => _1.Comics.getTopChapterComics(...params),
    },
    {
        path: '/follow',
        callback: (...params) => _1.Comics.getTopFollowComics(...params),
    },
    {
        path: '/comment',
        callback: (...params) => _1.Comics.getTopCommentComics(...params),
    },
];
topComicsApiPaths.forEach(({ path, callback }) => {
    router.get(`/top${path}`, asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = req;
        const status = String(query.status || 'all');
        const page = Number(query.page) || 1;
        const data = yield callback(status, page);
        res.json(data);
    })));
});
router.get('/images', asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { src } = req.query;
    if (!src) {
        return res.status(400).json({ status: 400, message: 'Missing src parameter' });
    }
    try {
        const response = yield axios_1.default.get(String(src), {
            responseType: 'stream',
            headers: {
                referer: process.env.NETTRUYEN_BASE_URL || 'https://nettruyenar.com/',
                'User-Agent': userAgent.getRandom(),
            },
            timeout: 15000,
        });
        response.data.pipe(res);
    }
    catch (err) {
        console.error('Images proxy error:', err.message);
        res.status(502).json({ status: 502, message: 'Failed to fetch image' });
    }
})));
exports.default = router;
