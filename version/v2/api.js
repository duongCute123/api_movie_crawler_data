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
// Genres
router.get('/genres', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield _1.Comics.getGenres());
}));
router.get('/genres/:slug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params, query } = req;
    const slug = params.slug;
    const page = query.page ? Number(query.page) : 1;
    const status = query.status ? query.status : 'all';
    //@ts-ignore
    if (!allStatus.includes(status))
        throw Error('Invalid status');
    //@ts-ignore
    res.send(yield _1.Comics.getComicsByGenre(slug, page, status));
}));
// New Comics
router.get(`/new-comics`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const status = query.status ? query.status : 'all';
    const page = query.page ? Number(query.page) : 1;
    //@ts-ignore
    if (!allStatus.includes(status))
        throw Error('Invalid status');
    // @ts-ignore
    res.json(yield _1.Comics.getNewComics(status, page));
}));
// Recommend Comics
router.get(`/recommend-comics`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req;
    const type = query.type ? query.type : 'hot';
    // @ts-ignore
    res.json(yield _1.Comics.getRecommendComics(type));
}));
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
    router.get(path, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = req;
        const q = query.q ? query.q : '';
        if (!q)
            throw Error('Invalid query');
        const page = query.page ? Number(query.page) : 1;
        //@ts-ignore
        res.send(yield callback(q, page));
    }));
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
    router.get(path, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = req;
        const page = query.page ? Number(query.page) : 1;
        res.json(yield callback(page));
    }));
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
    router.get(path, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { params } = req;
        const slug = params.slug;
        if (!slug)
            throw Error('Invalid');
        res.json(yield callback(slug));
    }));
});
router.get('/comics/:slug/chapters/:chapter_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params } = req;
    const slug = params.slug;
    const chapter_id = params.chapter_id ? Number(params.chapter_id) : null;
    if (!slug || !chapter_id)
        throw Error('Invalid');
    res.json(yield _1.Comics.getChapter(slug, chapter_id));
}));
router.get('/comics/:slug/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params, query } = req;
    const slug = params.slug;
    const page = query.page ? Number(query.page) : 1;
    // @ts-ignore
    if (!slug)
        throw Error('Invalid Comic ID');
    res.json(yield _1.Comics.getComments(slug, page));
}));
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
    router.get(`/top${path}`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = req;
        const status = query.status ? query.status : 'all';
        // @ts-ignore
        const page = query.page ? Number(query.page) : 1;
        res.json(yield callback(status, page));
    }));
});
router.get('/images', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { src } = req.query;
        const response = yield axios_1.default.get(src, {
            responseType: 'stream',
            headers: {
                referer: process.env.NETTRUYEN_BASE_URL,
                'User-Agent': userAgent.getRandom(),
            },
        });
        response.data.pipe(res);
    }
    catch (err) {
        throw err;
    }
}));
exports.default = router;
