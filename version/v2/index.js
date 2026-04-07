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
exports.Comics = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const userAgent = __importStar(require("random-useragent"));
const genres_json_1 = __importDefault(require("./genres.json"));
class ComicsApi {
    constructor() {
        this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
        this.domain = process.env.NETTRUYEN_BASE_URL;
        this.agent = userAgent.getRandom();
        this.cache = new Map();
    }
    getCached(key) {
        const item = this.cache.get(key);
        if (item && Date.now() - item.timestamp < this.CACHE_TTL) {
            return item.data;
        }
        this.cache.delete(key);
        return null;
    }
    setCache(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }
    createRequest(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const domain = this.domain.replace(/\/+$/, '');
                const fullPath = path ? `/${path}` : '/';
                const url = `${domain}${fullPath}`.replace(/\/+/g, '/').replace(/\?+/g, '?');
                console.log(`[DEBUG] Request URL: ${url}, Domain: ${this.domain}`);
                const { data } = yield axios_1.default.get(url, {
                    headers: {
                        'User-Agent': this.agent,
                    },
                    timeout: 30000,
                });
                return (0, cheerio_1.load)(data);
            }
            catch (err) {
                console.log(`[DEBUG] Error: ${err.message}`);
                throw err;
            }
        });
    }
    getComicId(link) {
        if (!link)
            return "";
        return link.split("/").at(-1);
    }
    getGenreId(link) {
        var _a;
        if (!link)
            return "";
        return (_a = link === null || link === void 0 ? void 0 : link.match(/[^/]+$/)) === null || _a === void 0 ? void 0 : _a[0];
    }
    formatTotal(total) {
        if (!total)
            return 0;
        return total === "N/A" ? "Updating" : Number(total === null || total === void 0 ? void 0 : total.replace(/\./g, ""));
    }
    trim(text) {
        return text === null || text === void 0 ? void 0 : text.replace(/\n/g, "").trim();
    }
    compactNumber(total) {
        return Intl.NumberFormat(undefined, {
            notation: "compact",
            maximumFractionDigits: 2,
        }).format(total);
    }
    getComics(path, page = 1, statusKey = "all") {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const keys = {
                "Thể loại": "genres",
                "Tình trạng": "status",
                "Lượt xem": "total_views",
                "Bình luận": "total_comments",
                "Theo dõi": "followers",
                "Tên khác": "other_names",
                "Ngày cập nhật": "updated_at",
                "Tác giả": "authors",
            };
            const status = {
                all: -1,
                updating: 1,
                completed: 2,
            };
            if (!status[statusKey])
                throw Error("Invalid status");
            try {
                const [$, allGenres] = yield Promise.all([
                    this.createRequest(path.includes("tim-truyen")
                        ? `${path}&status=${status[statusKey]}&page=${page}`
                        : `${path + (path.includes("?") ? "&" : "?")}page=${page}`),
                    this.getGenres(),
                ]);
                const total_pages = ((_b = (_a = $('a[title="Trang cuối"]')) === null || _a === void 0 ? void 0 : _a.attr("href")) === null || _b === void 0 ? void 0 : _b.split("=").at(-1)) ||
                    $(".pagination-outter li.active a").text() ||
                    1;
                if (page > Number(total_pages)) {
                    return { status: 404, message: "Page not found" };
                }
                const comics = Array.from($("#ctl00_divCenter .item")).map((item) => {
                    var _a;
                    const thumbnail = (_a = $(".image img", item).attr("data-original")) === null || _a === void 0 ? void 0 : _a.replace(/^https:/, "");
                    const title = this.trim($("figcaption h3", item).text());
                    const id = this.getComicId($("a", item).attr("href"));
                    const is_trending = !!$(".icon-hot", item).toString();
                    const short_description = $(".box_text", item)
                        .text()
                        .replace(/-/g, "")
                        .replace(/\n/g, " ");
                    const cols = Array.from($(".message_main p", item)).map((col) => {
                        var _a;
                        const [_, label, detail] = (_a = this.trim($(col).text())) === null || _a === void 0 ? void 0 : _a.match(/^(.*?):(.*)$/);
                        const value = /,|;\s*| - /.test(detail)
                            ? detail.split(/,|;\s*| - /)
                            : detail;
                        const key = keys[label];
                        if (key === "genres") {
                            const genresList = Array.isArray(value) ? value : [value];
                            const genres = genresList.map((genre) => {
                                const foundGenre = allGenres.find((g) => g.name.toLowerCase() === genre.toLowerCase());
                                return { id: foundGenre === null || foundGenre === void 0 ? void 0 : foundGenre.id, name: foundGenre === null || foundGenre === void 0 ? void 0 : foundGenre.name };
                            });
                            return { genres };
                        }
                        if (key === "status") {
                            return {
                                status: value === "Hoàn thành" ? "Completed" : "Ongoing",
                            };
                        }
                        return {
                            [key]: value,
                        };
                    });
                    const lastest_chapters = Array.from($(".comic-item li", item)).map((chap) => {
                        const id = Number($("a", chap).attr("data-id"));
                        const name = $("a", chap).attr("title");
                        const updated_at = $(".time", chap).text();
                        return {
                            id,
                            name,
                            updated_at,
                        };
                    });
                    const comic = Object.assign({}, {
                        thumbnail,
                        title,
                        id,
                        is_trending,
                        short_description,
                        lastest_chapters,
                        genres: [],
                        other_names: [],
                        status: "Updating",
                        total_views: "Updating",
                        total_comments: "Updating",
                        followers: "Updating",
                        updated_at: "Updating",
                        authors: "Updating",
                    }, ...cols);
                    return Object.assign(Object.assign({}, comic), { total_comments: this.compactNumber(+comic.total_comments.toString().replace(/\,/g, "")), followers: this.compactNumber(+comic.followers.toString().replace(/\,/g, "")) });
                });
                return { comics, total_pages: Number(total_pages), current_page: page };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getChapters(comicId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const $ = yield this.createRequest(`truyen-tranh/${comicId}`);
                const id = $(".star").attr("data-id");
                const { data } = yield axios_1.default.get(`${this.domain}/Comic/Services/ComicService.asmx/ProcessChapterList?comicId=${id}`, {
                    headers: {
                        "User-Agent": this.agent,
                    },
                });
                const chapters = (_a = data.chapters) === null || _a === void 0 ? void 0 : _a.map((chapter) => {
                    return {
                        id: +chapter.url.split("-").at(-1),
                        name: chapter.name,
                    };
                });
                return chapters;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            return genres_json_1.default;
        });
    }
    getRecommendComics(type = "hot") {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = {
                hot: "truyen-tranh-hot",
                boy: "truyen-con-trai",
                girl: "truyen-con-gai",
            };
            const $ = yield this.createRequest(keys[type]);
            const comics = Array.from($("#ctl00_divAlt1 .owl-carousel .item")).map((item) => {
                var _a, _b;
                const href = $("a", item).attr("href") || "";
                const id = this.getComicId(href);
                const title = $("h3 a", item).text() || $("a", item).attr("title") || "";
                const thumbnail = (_a = $("img", item).attr("data-original")) === null || _a === void 0 ? void 0 : _a.replace(/^https:/, "");
                const updated_at = this.trim($(".time", item).text());
                const chapterHref = $(".slide-caption > a", item).attr("href") || "";
                const chapter_id = Number((_b = chapterHref.split("/").pop()) === null || _b === void 0 ? void 0 : _b.split("-").pop()) || 0;
                const name = $(".slide-caption > a", item).attr("title") || "";
                return {
                    id,
                    title,
                    thumbnail,
                    updated_at,
                    lastest_chapter: {
                        id: chapter_id,
                        name,
                    },
                };
            });
            return comics;
        });
    }
    getRecentUpdateComics(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("", page);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getCompletedComics(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?", page, "completed");
            }
            catch (err) {
                throw err;
            }
        });
    }
    getNewComics(status = "all", page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?sort=15", page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getComicsByGenre(genreId, page = 1, status = "all") {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const path = genreId === "all" ? "tim-truyen?" : `tim-truyen/${genreId}?`;
                return yield this.getComics(path, page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTopDailyComics(status = "all", page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?sort=13", page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTopWeeklyComics(status = "all", page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?sort=12", page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTopMonthlyComics(status = "all", page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?sort=11", page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTopFollowComics(status = "all", page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?sort=20", page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTopCommentComics(status = "all", page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?sort=25", page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTopAllComics(status = "all", page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?sort=10", page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTopChapterComics(status = "all", page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?sort=30", page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTrendingComics(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("truyen-tranh-hot?", page);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getBoyComics(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("truyen-con-trai?", page);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getGirlComics(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("truyen-con-gai?", page);
            }
            catch (err) {
                throw err;
            }
        });
    }
    searchComics(query, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics(`tim-truyen?keyword=${query.replace(/\s+/g, "+")}&`, page);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getComicDetail(comicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [$, chapters] = yield Promise.all([
                    this.createRequest(`truyen-tranh/${comicId}`),
                    this.getChapters(comicId),
                ]);
                const title = $(".title-detail").text();
                const thumbnail = $("#item-detail .col-image img").attr("src");
                const description = $(".shortened div")
                    .text()
                    .replace(/\n/g, " ")
                    .replace(/-/g, "")
                    .replace(/NhatTruyen/g, "NComics")
                    .trim();
                let authors = $(".author p:nth-child(2)").text();
                authors = /, |;\s*| - /.test(authors)
                    ? authors.split(/, |;\s*| - /)
                    : authors !== "Đang cập nhật"
                        ? $(".author p:nth-child(2)").text()
                        : "Updating";
                const status = $(".status p:nth-child(2)").text() === "Hoàn thành"
                    ? "Finished"
                    : "Ongoing";
                const genres = Array.from($(".kind p:nth-child(2) a")).map((item) => {
                    const id = this.getGenreId($(item).attr("href"));
                    const name = $(item).text();
                    return { id, name };
                });
                const is_adult = !!$(".alert-danger").toString();
                const other_names = $(".other-name")
                    .text()
                    .split(/, |;| - /)
                    .map((x) => x.trim());
                const total_views = this.formatTotal($(".list-info .row:last-child p:nth-child(2)").text());
                const rating_count = Number($('span[itemprop="ratingCount"]').text());
                const average = Number($('span[itemprop="ratingValue"]').text());
                const followers = this.formatTotal($(".follow b").text());
                return {
                    title,
                    thumbnail,
                    description,
                    authors,
                    status,
                    genres,
                    total_views,
                    average,
                    rating_count,
                    followers,
                    chapters,
                    id: comicId,
                    is_adult,
                    other_names: other_names[0] !== "" ? other_names : [],
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getChapter(comicId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [$, chapters] = yield Promise.all([
                    this.createRequest(`truyen-tranh/${comicId}/chuong-${chapterId}`),
                    this.getChapters(comicId),
                ]);
                const images = Array.from($(".page-chapter img")).map((img, idx) => {
                    var _a;
                    const src = `/images?src=${$(img).attr("data-sv1")}`;
                    const backup_url = `/images?src=${$(img).attr("data-sv2")}`;
                    const page = parseInt(((_a = src.split("/")) === null || _a === void 0 ? void 0 : _a.at(-1)) || `${idx}`);
                    return { page, src, backup_url };
                });
                const chapter_name = $(".breadcrumb li:last-child").first().text();
                const comic_name = $(".breadcrumb li:nth-last-child(2)").first().text();
                return { images, chapters, chapter_name, comic_name };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getComicsByAuthor(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.getComics(`/tim-truyen?tac-gia=${alias.replace(/\s+/, "+")}`);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getComments(comicId, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const avatar = "https://api.iconify.design/ei/user.svg?height=48";
                const body = yield this.createRequest(`truyen-tranh/${comicId}`);
                const id = body(".star").attr("data-id");
                const url = `${this.domain}/Comic/Services/CommentService.asmx/List?comicId=${id}&pageNumber=${page}`;
                const { data } = yield axios_1.default.get(url, {
                    headers: { "User-Agent": this.agent },
                });
                const total_comments = data.data.commentCount;
                const $ = (0, cheerio_1.load)(data.data.response);
                const total_pages = Math.ceil(total_comments / 15);
                if (page > total_pages) {
                    return { status: 400, message: "Invalid page" };
                }
                const comments = Array.from($(".clearfix")).map((item) => {
                    const username = $(item).find(".authorname").first().text().trim();
                    const content = $(".comment-content", item).first().text().trim();
                    const stickers = Array.from($(item).find("> .summary > .info > .comment-content > img")).map((img) => {
                        var _a, _b;
                        return (_b = (_a = $(img)
                            .attr("src")) === null || _a === void 0 ? void 0 : _a.match(/url=(.*)$/)) === null || _b === void 0 ? void 0 : _b[1];
                    });
                    const created_at = $(".comment-footer abbr", item)
                        .first()
                        .attr("title");
                    const replies = Array.from($(".item", item)).map((reply) => {
                        const username = $(".authorname", reply).text().trim();
                        const content = $(".comment-content", reply)
                            .clone()
                            .children()
                            .remove()
                            .end()
                            .text()
                            .trim();
                        const stickers = Array.from($(".comment-content > img", reply)).map((img) => {
                            var _a, _b;
                            return (_b = (_a = $(img)
                                .attr("src")) === null || _a === void 0 ? void 0 : _a.match(/url=(.*)$/)) === null || _b === void 0 ? void 0 : _b[1];
                        });
                        const created_at = $(".comment-footer abbr", reply).attr("title");
                        const mention_user = $(".mention-user", reply).text().trim();
                        return {
                            avatar,
                            username,
                            content,
                            stickers,
                            created_at,
                            vote_count: 0,
                            mention_user,
                        };
                    });
                    return {
                        avatar,
                        username,
                        content,
                        stickers,
                        replies,
                        created_at,
                        vote_count: 0,
                    };
                });
                return { comments, total_comments, total_pages, current_page: page };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getSearchSuggest(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `search-suggest:${query}`;
            const cached = this.getCached(cacheKey);
            if (cached)
                return cached;
            try {
                query = query.trim();
                if (!query)
                    throw Error("Invalid query");
                const { data } = yield axios_1.default.get(`${this.domain}/Comic/Services/SuggestSearch.ashx?q=${query}`, { headers: { "User-Agent": this.agent } });
                const $ = (0, cheerio_1.load)(data);
                const suggestions = Array.from($("li")).map((comic) => {
                    const id = this.getComicId($("a", comic).attr("href"));
                    const thumbnail = $("img", comic).attr("src");
                    const title = $("h3", comic).text();
                    const lastest_chapter = $("i", comic).first().text();
                    const genres = $("i", comic).last().text();
                    const authors = $("b", comic).text() || "Updating";
                    return {
                        id,
                        title,
                        thumbnail,
                        lastest_chapter: lastest_chapter.startsWith("Chapter")
                            ? lastest_chapter
                            : "Updating",
                        genres: genres !== lastest_chapter ? genres.split(", ") : "Updating",
                        authors: authors === "Updating" ? authors : authors.split(" - "),
                    };
                });
                this.setCache(cacheKey, suggestions);
                return suggestions;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
const Comics = new ComicsApi();
exports.Comics = Comics;
