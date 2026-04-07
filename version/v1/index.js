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
const cheerio_1 = require("cheerio");
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const https = __importStar(require("https"));
const userAgent = __importStar(require("random-useragent"));
dotenv.config();
const agent = new https.Agent({
    rejectUnauthorized: false,
});
class ComicsApi {
    // private cdnProviders: string[];
    // private providers: string[];
    constructor() {
        var _a;
        this.hosts = (_a = process.env.HOSTS) === null || _a === void 0 ? void 0 : _a.split(" | ");
        this.agent = userAgent.getRandom();
        this.cdnImageUrl = process.env.CND_IMAGE_URL;
        // this.providers = process.env.PROVIDERS?.split(" | ") as string[];
        // this.cdnProviders = process.env.CDN_PROVIDERS?.split(" | ") as string[];
    }
    createRequest(path, host = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.request({
                    method: "GET",
                    url: `https://${this.hosts[host]}/${path}`.replace(/\?+/g, "?"),
                    headers: {
                        "User-Agent": this.agent,
                        Referrer: this.hosts[0],
                    },
                    httpsAgent: agent,
                });
                return (0, cheerio_1.load)(data);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getId(link, type) {
        var _a;
        if (!link)
            return "";
        const regex = type === "genre" ? /\/([^/]+?)$/ : /\/([^/]+?)(?:-\d+)?$/;
        return (_a = link === null || link === void 0 ? void 0 : link.match(regex)) === null || _a === void 0 ? void 0 : _a[1];
    }
    getChapterId(link) {
        var _a;
        if (!link)
            return 0;
        return Number(((_a = link === null || link === void 0 ? void 0 : link.match(/chapter-(\d+)/i)) === null || _a === void 0 ? void 0 : _a[1]) || 0);
    }
    formatTotal(total) {
        if (!total)
            return 0;
        return total === "N/A" ? "Updating" : Number(total === null || total === void 0 ? void 0 : total.replace(/\.|\,/g, ""));
    }
    trim(text) {
        return text === null || text === void 0 ? void 0 : text.replace(/\n|\t/g, "").trim();
    }
    getComics(path, page = 1, statusKey = "all") {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const status = {
                all: -1,
                updating: 1,
                completed: 2,
            };
            try {
                const $ = yield this.createRequest(`${path + (path.includes("?") ? "&" : "?")}status=${status[statusKey]}&page=${page}`);
                const total_pages = ((_a = $(".pagination li:nth-last-child(2) a")
                    .attr("href")) === null || _a === void 0 ? void 0 : _a.split("=").at(-1)) ||
                    $(".pagination .active").text() ||
                    1;
                if (page > total_pages) {
                    return { status: 404, message: "Page not found" };
                }
                const comics = Array.from($("#ctl00_divCenter .item")).map((item) => {
                    var _a, _b;
                    const id = this.getId($("a", item).attr("href"));
                    const thumbnail = $("img", item).attr("src");
                    const title = this.trim($("figcaption h3", item).text());
                    const is_trending = !!$(".hot", item).toString();
                    const [total_views, comments, followers] = ((_a = this.trim($(".pull-left", item).text())) === null || _a === void 0 ? void 0 : _a.split(/\s+/g)) || [];
                    const last_chapters = Array.from($(".comic-item .chapter", item)).map((chapter) => {
                        const id = this.getChapterId($("a", chapter).attr("href"));
                        const name = this.trim($("a", chapter).text());
                        const updated_at = $(".time", chapter).text();
                        return {
                            id,
                            name,
                            updated_at,
                        };
                    });
                    return {
                        id,
                        title,
                        thumbnail,
                        backup_thumb: `${this.cdnImageUrl}/${id}.jpg`,
                        updated_at: ((_b = last_chapters[0]) === null || _b === void 0 ? void 0 : _b.updated_at) || "N/A",
                        is_trending,
                        total_views: total_views || "N/A",
                        followers: followers || comments || "N/A",
                        last_chapters,
                    };
                });
                return {
                    comics,
                    total_pages: +total_pages,
                    current_page: page,
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const $ = yield this.createRequest("");
                return Array.from($("#mainNav li:nth-child(7) a")).map((item) => {
                    const id = $(item).attr("href").split("/").at(-1);
                    const name = this.trim($(item).text());
                    return {
                        id: id === "tim-truyen" ? "all" : id,
                        name: id === "tim-truyen" ? "Tất cả" : name,
                    };
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    getRecommendComics() {
        return __awaiter(this, void 0, void 0, function* () {
            const $ = yield this.createRequest("");
            const comics = Array.from($(".owl-carousel .item")).map((item) => {
                const id = this.getId($("a", item).attr("href"));
                const title = $("a", item).attr("alt");
                const thumbnail = $("img", item).attr("src");
                const updated_at = this.trim($(".time", item).text());
                const name = $(".slide-caption > a", item).text();
                const chapter_id = this.getChapterId($(".slide-caption > a", item).attr("href"));
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
    getNewComics(page = 1, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?sort=8", page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getRecentUpdateComics(page = 1, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?", page, status);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getTrendingComics(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?sort=12", page);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getBoyComics(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("truyen-tranh-con-trai?", page);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getGirlComics(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("truyen-tranh-con-gai?", page);
            }
            catch (err) {
                throw err;
            }
        });
    }
    getComicsByGenre(genreId, page = 1, status) {
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
    getCompletedComics(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics("tim-truyen?status=2", page, "completed");
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
    getComicDetail(comicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [$, chapters] = yield Promise.all([
                    this.createRequest(`truyen-tranh/${comicId}-1`),
                    this.getChapters(comicId),
                ]);
                const title = $(".title-detail").text();
                const thumbnail = $(".detail-info img").attr("src");
                const description = this.trim($(".detail-content p")
                    .text()
                    .replace(/nettruyen/gi, "NComics")
                    .replace(/\s+/g, " ")) ||
                    `Truyện tranh ${title} được cập nhật nhanh và đầy đủ nhất tại NComics. Bạn đọc đừng quên để lại bình luận và chia sẻ, ủng hộ NComics ra các chương mới nhất của truyện ${title}.`;
                let authors = $(".author p:nth-child(2)").text();
                authors = /, |;\s*| - /.test(authors)
                    ? authors
                        .split(/, |;\s*| - /)
                        .map((author) => this.trim(author))
                    : authors.toLowerCase() !== "đang cập nhật"
                        ? this.trim($(".author p:nth-child(2)").text())
                        : "Updating";
                const status = $(".status p:nth-child(2)").text() === "Hoàn thành"
                    ? "Completed"
                    : "Ongoing";
                const genres = Array.from($(".kind p:nth-child(2) a")).map((item) => {
                    const id = this.getId($(item).attr("href"), "genre");
                    const name = $(item).text();
                    return { id, name };
                });
                const other_names = $(".othername h2").text().split("; ");
                const total_views = this.formatTotal($("#item-detail li:nth-child(5) p:nth-child(2)").text());
                const followers = this.formatTotal($(".follow b").text());
                const rate = $("span[itemprop='ratingValue']").text() * 2;
                const total_vote = this.formatTotal($("span[itemprop='ratingCount']").text());
                return {
                    title,
                    thumbnail,
                    backup_thumb: `${this.cdnImageUrl}/${comicId}.jpg`,
                    description,
                    status,
                    genres,
                    total_views,
                    followers,
                    rate,
                    total_vote,
                    authors,
                    id: comicId,
                    other_names: other_names[0] !== "" ? other_names : [],
                    chapters,
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getChapters(comicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const $ = yield this.createRequest(`truyen-tranh/${comicId}-1`);
                const chapters = Array.from($(".list-chapter ul .row")).map((chapter) => {
                    const name = $("a", chapter).text();
                    const id = this.getChapterId($("a", chapter).attr("href"));
                    const updated_at = $(".no-wrap", chapter).text().trim();
                    const total_view = this.formatTotal($("div:last-child", chapter).text());
                    return { id, name, updated_at, total_view };
                });
                return chapters;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getChapter(comicId, chapterId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [$, chapters] = yield Promise.all([
                    this.createRequest(`truyen-tranh/${comicId}/chapter-${chapterId}/0`),
                    this.getChapters(comicId),
                ]);
                const images = Array.from($(".page-chapter img")).map((img, idx) => ({
                    page: idx + 1,
                    src: $(img).attr("src"),
                }));
                const [comic_name, chapter_name] = (_a = this.trim($(".txt-primary").text().trim())) === null || _a === void 0 ? void 0 : _a.split(" - ");
                return { images, chapters, chapter_name, comic_name };
            }
            catch (err) {
                throw err;
            }
        });
    }
    getSearchSuggest(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                query = query.trim();
                if (!query)
                    throw Error("Invalid query");
                const $ = yield this.createRequest(`webapi/suggest-search?q=${query}`);
                const suggestions = Array.from($("li")).map((comic) => {
                    const id = this.getId($("a", comic).attr("href"));
                    const thumbnail = $("img", comic).attr("src");
                    const title = $("h3", comic).text();
                    const lastest_chapter = $("i", comic).first().text();
                    return {
                        id,
                        title,
                        thumbnail,
                        lastest_chapter: lastest_chapter.startsWith("Tới")
                            ? lastest_chapter.replace(/Tới /i, "")
                            : "Updating",
                    };
                });
                return suggestions;
            }
            catch (err) {
                throw err;
            }
        });
    }
    searchComics(query, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getComics(`tim-truyen?q=${query.trim().replace(/\s+/g, "+")}`, page);
            }
            catch (err) {
                throw err;
            }
        });
    }
}
const Comics = new ComicsApi();
exports.Comics = Comics;
