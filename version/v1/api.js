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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const _1 = require(".");
const random_useragent_1 = __importDefault(require("random-useragent"));
const allStatus = ["all", "completed", "ongoing"];
const router = express_1.default.Router();
// Genres
router.get("/genres", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield _1.Comics.getGenres());
}));
router.get("/genres/:slug", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params, query } = req;
        const slug = params.slug;
        const page = query.page ? Number(query.page) : 1;
        const status = query.status ? `${query.status}` : "all";
        if (!allStatus.includes(status))
            throw Error("Invalid status");
        res.json(yield _1.Comics.getComicsByGenre(slug, page, status));
    }
    catch (err) {
        next(err);
    }
}));
// Page params
const statusPaths = [
    {
        path: "/new-comics",
        callback: (page, status) => _1.Comics.getNewComics(page, status),
    },
    {
        path: "/recent-update-comics",
        callback: (page, status) => _1.Comics.getRecentUpdateComics(page, status),
    },
];
statusPaths.forEach(({ path, callback }) => {
    router.get(path, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { query } = req;
            const status = query.status ? `${query.status}` : "all";
            const page = query.page ? Number(query.page) : 1;
            if (!allStatus.includes(status))
                throw Error("Invalid status");
            res.json(yield callback(page, status));
        }
        catch (err) {
            next(err);
        }
    }));
});
// Recommend Comics
router.get(`/recommend-comics`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield _1.Comics.getRecommendComics());
}));
// Search
const searchApiPaths = [
    {
        path: "/search",
        callback: (q, page) => _1.Comics.searchComics(q, page),
    },
    {
        path: "/search-suggest",
        callback: (q) => _1.Comics.getSearchSuggest(q),
    },
];
searchApiPaths.forEach(({ path, callback }) => {
    router.get(path, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { query } = req;
            const q = query.q ? `${query.q}` : "";
            if (!q)
                throw Error("Invalid query");
            const page = query.page ? Number(query.page) : 1;
            res.json(yield callback(q, page));
        }
        catch (err) {
            next(err);
        }
    }));
});
// Page params
const pageParamsApiPaths = [
    // {
    //   path: '/boy-comics',
    //   callback: (page: number) => Comics.getBoyComics(page),
    // },
    // {
    //   path: '/girl-comics',
    //   callback: (page: number) => Comics.getGirlComics(page),
    // },
    {
        path: "/completed-comics",
        callback: (page) => _1.Comics.getCompletedComics(page),
    },
    {
        path: "/trending-comics",
        callback: (page) => _1.Comics.getTrendingComics(page),
    },
];
pageParamsApiPaths.forEach(({ path, callback }) => {
    router.get(path, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { query } = req;
            const page = query.page ? Number(query.page) : 1;
            res.json(yield callback(page));
        }
        catch (err) {
            next(err);
        }
    }));
});
// Comics
const comicIdParamsApiPaths = [
    {
        path: "/comics/:slug/chapters",
        callback: (params) => _1.Comics.getChapters(params),
    },
    {
        path: "/comics/:slug",
        callback: (params) => _1.Comics.getComicDetail(params),
    },
];
comicIdParamsApiPaths.forEach(({ path, callback }) => {
    router.get(path, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { params } = req;
            const slug = params.slug;
            if (!slug)
                throw Error("Invalid");
            res.json(yield callback(slug));
        }
        catch (err) {
            next(err);
        }
    }));
});
router.get("/comics/:slug/chapters/:chapter_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params } = req;
    const slug = params.slug;
    const chapter_id = params.chapter_id ? Number(params.chapter_id) : null;
    if (!slug || !chapter_id)
        throw Error("Invalid");
    res.json(yield _1.Comics.getChapter(slug, chapter_id));
}));
// Top Comics
const topComicsApiPaths = [
    {
        path: "/",
        callback: (status, page) => _1.Comics.getTopAllComics(status, page),
    },
    {
        path: "/weekly",
        callback: (status, page) => _1.Comics.getTopWeeklyComics(status, page),
    },
    {
        path: "/monthly",
        callback: (status, page) => _1.Comics.getTopMonthlyComics(status, page),
    },
    {
        path: "/daily",
        callback: (status, page) => _1.Comics.getTopDailyComics(status, page),
    },
    {
        path: "/chapter",
        callback: (status, page) => _1.Comics.getTopChapterComics(status, page),
    },
    {
        path: "/follow",
        callback: (status, page) => _1.Comics.getTopFollowComics(status, page),
    },
    {
        path: "/comment",
        callback: (status, page) => _1.Comics.getTopCommentComics(status, page),
    },
];
topComicsApiPaths.forEach(({ path, callback }) => {
    router.get(`/top${path}`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = req;
        const status = query.status ? query.status : "all";
        const page = query.page ? Number(query.page) : 1;
        res.json(yield callback(status, page));
    }));
});
router.get("/images", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const src = req.query.src;
        if (!src)
            throw new Error("Invalid image source");
        const response = yield axios_1.default.get(`${src}`, {
            responseType: "stream",
            headers: {
                referer: `https://${process.env.HOSTS}`,
                "User-Agent": random_useragent_1.default.getRandom(),
            },
        });
        response.data.pipe(res);
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
