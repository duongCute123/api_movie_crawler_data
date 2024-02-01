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
exports.Comics = void 0;
var cheerio_1 = require("cheerio");
var axios_1 = require("axios");
var dotenv_1 = require("dotenv");
var https_1 = require("https");
var random_useragent_1 = require("random-useragent");
dotenv_1.default.config();
var agent = new https_1.default.Agent({
    rejectUnauthorized: false,
});
var ComicsApi = /** @class */ (function () {
    function ComicsApi() {
        var _a;
        this.hosts = (_a = process.env.HOSTS) === null || _a === void 0 ? void 0 : _a.split(' | ');
        this.agent = random_useragent_1.default.getRandom();
    }
    ComicsApi.prototype.createRequest = function (path, host) {
        if (host === void 0) { host = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.request({
                                method: 'GET',
                                url: "https://".concat(this.hosts[host], "/").concat(path).replace(/\?+/g, '?'),
                                headers: {
                                    'User-Agent': this.agent,
                                },
                                httpsAgent: agent,
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, (0, cheerio_1.load)(data)];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getId = function (link, type) {
        var _a;
        if (!link)
            return '';
        var regex = type === 'genre' ? /\/([^/]+?)$/ : /\/([^/]+?)(?:-\d+)?$/;
        return (_a = link === null || link === void 0 ? void 0 : link.match(regex)) === null || _a === void 0 ? void 0 : _a[1];
    };
    ComicsApi.prototype.formatTotal = function (total) {
        if (!total)
            return 0;
        return total === 'N/A' ? 'Updating' : Number(total === null || total === void 0 ? void 0 : total.replace(/\./g, ''));
    };
    ComicsApi.prototype.trim = function (text) {
        return text === null || text === void 0 ? void 0 : text.replace(/\n|\t/g, '').trim();
    };
    ComicsApi.prototype.getComics = function (path, page, statusKey) {
        var _a;
        if (page === void 0) { page = 1; }
        if (statusKey === void 0) { statusKey = 'all'; }
        return __awaiter(this, void 0, void 0, function () {
            var status, isEmptyPath, _b, $_1, allGenres_1, total_pages, comics, err_2;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        status = {
                            all: -1,
                            updating: 1,
                            completed: 2,
                        };
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        isEmptyPath = ['tim-truyen?', 'tim-truyen?sort=15'].includes(path);
                        return [4 /*yield*/, Promise.all([
                                this.createRequest("".concat(path + (path.includes('?') ? '&' : '?'), "status=").concat(status[statusKey], "&page=").concat(isEmptyPath ? page + 1 : page)),
                                this.getGenres(),
                            ])];
                    case 2:
                        _b = _c.sent(), $_1 = _b[0], allGenres_1 = _b[1];
                        total_pages = ((_a = $_1('.pagination li:nth-last-child(2) a')
                            .attr('href')) === null || _a === void 0 ? void 0 : _a.split('=').at(-1)) ||
                            $_1('.pagination .active').text() ||
                            1;
                        if (page > total_pages) {
                            return [2 /*return*/, { status: 404, message: 'Page not found' }];
                        }
                        comics = Array.from($_1('#main_homepage .list_grid li')).map(function (item) {
                            var thumbnail = $_1('.book_avatar img', item).attr('src');
                            var title = $_1('.book_avatar img', item).attr('alt');
                            var id = _this.getId($_1('a', item).attr('href'));
                            var is_trending = !!$_1('.hot', item).toString();
                            var updated_at = $_1('.time-ago', item).text();
                            var short_description = _this.trim($_1('.excerpt', item).text());
                            var other_names = $_1('.title-more-other', item)
                                .text()
                                .replace(/Tên khác: /, '')
                                .split('; ');
                            var status = $_1('.info', item)
                                .text()
                                .replace(/Tình trạng: /, '');
                            var total_views = $_1('.info', item)
                                .eq(1)
                                .text()
                                .match(/\d+/g)
                                .join('');
                            var followers = $_1('.info', item)
                                .eq(2)
                                .text()
                                .match(/\d+/g)
                                .join('');
                            var chapter_name = $_1('.last_chapter a', item).attr('title');
                            var chapter_id = $_1('.last_chapter a', item)
                                .attr('href')
                                .split('/')
                                .at(-1);
                            var genres = Array.from($_1('.list-tags p', item))
                                .map(function (tag) {
                                var foundGenre = allGenres_1.find(function (g) {
                                    return $_1(tag).text().toLowerCase().trim() === g.name.toLowerCase();
                                });
                                if (!foundGenre)
                                    return null;
                                return { id: foundGenre.id, name: foundGenre.name };
                            })
                                .filter(Boolean);
                            return {
                                id: id,
                                title: title,
                                thumbnail: thumbnail,
                                updated_at: updated_at,
                                is_trending: is_trending,
                                genres: genres,
                                short_description: short_description,
                                other_names: Array.isArray(other_names)
                                    ? other_names
                                    : [other_names],
                                status: status.includes('Đang') ? 'Ongoing' : 'Completed',
                                total_views: Number(total_views),
                                followers: Number(followers),
                                last_chapter: {
                                    id: Number(chapter_id),
                                    name: /\d+/.test(chapter_name)
                                        ? "Chapter ".concat(chapter_name.match(/\d+/)[0])
                                        : chapter_name,
                                },
                            };
                        });
                        return [2 /*return*/, {
                                comics: comics,
                                total_pages: isEmptyPath ? +total_pages - 1 : +total_pages,
                                current_page: page,
                            }];
                    case 3:
                        err_2 = _c.sent();
                        throw err_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getGenres = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $_2, err_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createRequest('', Math.random() > 0.5 ? 0 : 2)];
                    case 1:
                        $_2 = _a.sent();
                        return [2 /*return*/, Array.from($_2('#mainNav .clearfix li a')).map(function (item) {
                                var id = $_2(item).attr('href').split('/').at(-1);
                                var name = _this.trim($_2(item).text());
                                var description = $_2(item).attr('data-title');
                                return { id: id === 'tim-truyen' ? 'all' : id, name: name, description: description };
                            })];
                    case 2:
                        err_3 = _a.sent();
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getRecommendComics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $, comics;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createRequest('', 1)];
                    case 1:
                        $ = _a.sent();
                        comics = Array.from($('#div_suggest li')).map(function (item) {
                            var id = _this.getId($('a', item).attr('href'));
                            var title = $('img', item).attr('alt');
                            var thumbnail = $('img', item).attr('src');
                            var updated_at = _this.trim($('.time-ago', item).text());
                            var name = $('.last_chapter > a', item).text();
                            var chapter_id = Number($('.last_chapter > a', item).attr('href').split('/').at(-1));
                            return {
                                id: id,
                                title: title,
                                thumbnail: thumbnail,
                                updated_at: updated_at,
                                lastest_chapter: {
                                    id: chapter_id,
                                    name: name,
                                },
                            };
                        });
                        return [2 /*return*/, comics];
                }
            });
        });
    };
    ComicsApi.prototype.getNewComics = function (page, status) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=15', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_4 = _a.sent();
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getRecentUpdateComics = function (page, status) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_5 = _a.sent();
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTrendingComics = function (page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('', page)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_6 = _a.sent();
                        throw err_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getBoyComics = function (page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('truyen-tranh-con-trai?', page)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_7 = _a.sent();
                        throw err_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getGirlComics = function (page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('truyen-tranh-con-gai?', page)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_8 = _a.sent();
                        throw err_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getComicsByGenre = function (genreId, page, status) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var path, err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        path = genreId === 'all' ? 'tim-truyen?' : "tim-truyen/".concat(genreId, "?");
                        return [4 /*yield*/, this.getComics(path, page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_9 = _a.sent();
                        throw err_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getCompletedComics = function (page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?status=2', page, 'completed')];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_10 = _a.sent();
                        throw err_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopAllComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=10', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_11 = _a.sent();
                        throw err_11;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopDailyComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=13', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_12 = _a.sent();
                        throw err_12;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopWeeklyComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=12', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_13 = _a.sent();
                        throw err_13;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopMonthlyComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=11', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_14 = _a.sent();
                        throw err_14;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopFollowComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=20', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_15 = _a.sent();
                        throw err_15;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopCommentComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=25', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_16 = _a.sent();
                        throw err_16;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopChapterComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=30', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_17 = _a.sent();
                        throw err_17;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getComicDetail = function (comicId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, $_3, chapters, title, thumbnail, description, authors, status_1, genres, other_names, total_views, followers, err_18;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                this.createRequest("truyen-tranh/".concat(comicId, "-1")),
                                this.getChapters(comicId),
                            ])];
                    case 1:
                        _a = _b.sent(), $_3 = _a[0], chapters = _a[1];
                        title = $_3('.book_detail h1').text();
                        thumbnail = $_3('.book_detail img').attr('src');
                        description = this.trim($_3('.detail-content p')
                            .text()
                            .replace(/TruyenQQ/g, 'NComics')) ||
                            "Truy\u1EC7n tranh ".concat(title, " \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt nhanh v\u00E0 \u0111\u1EA7y \u0111\u1EE7 nh\u1EA5t t\u1EA1i NComics. B\u1EA1n \u0111\u1ECDc \u0111\u1EEBng qu\u00EAn \u0111\u1EC3 l\u1EA1i b\u00ECnh lu\u1EADn v\u00E0 chia s\u1EBB, \u1EE7ng h\u1ED9 NComics ra c\u00E1c ch\u01B0\u01A1ng m\u1EDBi nh\u1EA5t c\u1EE7a truy\u1EC7n ").concat(title, ".");
                        authors = $_3('.author p:nth-child(2)').text();
                        authors = /, |;\s*| - /.test(authors)
                            ? authors.split(/, |;\s*| - /)
                            : authors.toLowerCase() !== 'đang cập nhật'
                                ? $_3('.author p:nth-child(2)').text()
                                : 'Updating';
                        status_1 = $_3('.status p:nth-child(2)').text() === 'Hoàn thành'
                            ? 'Completed'
                            : 'Ongoing';
                        genres = Array.from($_3('.list01 a')).map(function (item) {
                            var id = _this.getId($_3(item).attr('href'), 'genre');
                            var name = $_3(item).text();
                            return { id: id, name: name };
                        });
                        other_names = $_3('.other_name p:nth-child(2)').text().split('; ');
                        total_views = this.formatTotal($_3('.list-info .row:last-child p:nth-child(2)').text());
                        followers = this.formatTotal($_3('.list-info .row:nth-last-child(2) p:nth-child(2)').text());
                        return [2 /*return*/, {
                                title: title,
                                thumbnail: thumbnail,
                                description: description,
                                authors: authors,
                                status: status_1,
                                genres: genres,
                                total_views: total_views,
                                followers: followers,
                                chapters: chapters,
                                id: comicId,
                                other_names: other_names[0] !== '' ? other_names : [],
                            }];
                    case 2:
                        err_18 = _b.sent();
                        throw err_18;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getChapters = function (comicId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var $, id, data, chapters, err_19;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.createRequest("truyen-tranh/".concat(comicId, "-1"), 0)];
                    case 1:
                        $ = _b.sent();
                        id = $('.star').attr('data-id');
                        return [4 /*yield*/, axios_1.default.get("https://".concat(this.hosts[0], "/Comic/Services/ComicService.asmx/ProcessChapterList?comicId=").concat(id), {
                                headers: {
                                    'User-Agent': this.agent,
                                },
                            })];
                    case 2:
                        data = (_b.sent()).data;
                        chapters = (_a = data.chapters) === null || _a === void 0 ? void 0 : _a.map(function (chapter) {
                            return {
                                id: chapter.chapterId,
                                name: chapter.name,
                            };
                        });
                        return [2 /*return*/, chapters];
                    case 3:
                        err_19 = _b.sent();
                        throw err_19;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getChapter = function (comicId, chapterId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, $_4, chapters, images, _c, comic_name, chapter_name, err_20;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                this.createRequest("truyen-tranh/".concat(comicId, "/chapter/").concat(chapterId)),
                                this.getChapters(comicId),
                            ])];
                    case 1:
                        _b = _d.sent(), $_4 = _b[0], chapters = _b[1];
                        images = Array.from($_4('.page-chapter img')).map(function (img, idx) {
                            var src = "https://comics-api.vercel.app/images?src=".concat($_4(img).attr('data-sv1'));
                            var backup_src = "https://comics-api.vercel.app/images?src=".concat($_4(img).attr('data-sv2'));
                            return { page: idx + 1, src: src, backup_src: backup_src };
                        });
                        _c = (_a = this.trim($_4('.txt-primary').text().trim())) === null || _a === void 0 ? void 0 : _a.split(' - '), comic_name = _c[0], chapter_name = _c[1];
                        return [2 /*return*/, { images: images, chapters: chapters, chapter_name: chapter_name, comic_name: comic_name }];
                    case 2:
                        err_20 = _d.sent();
                        throw err_20;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getSearchSuggest = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var data, $_5, suggestions, err_21;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = query.trim();
                        if (!query)
                            throw Error('Invalid query');
                        return [4 /*yield*/, axios_1.default.get("https:".concat(this.hosts[0], "/Comic/Services/SuggestSearch.ashx?q=").concat(query), { headers: { 'User-Agent': this.agent } })];
                    case 1:
                        data = (_a.sent()).data;
                        $_5 = (0, cheerio_1.load)(data);
                        suggestions = Array.from($_5('li')).map(function (comic) {
                            var id = _this.getId($_5('a', comic).attr('href'));
                            var thumbnail = $_5('img', comic).attr('src');
                            var title = $_5('h3', comic).text();
                            var lastest_chapter = $_5('i', comic).first().text();
                            var genres = $_5('i', comic).last().text();
                            var authors = $_5('b', comic).text() || 'Updating';
                            return {
                                id: id,
                                title: title,
                                thumbnail: "https://nettruyennew.com/public/images/comics/".concat(_this.getId(thumbnail)),
                                lastest_chapter: lastest_chapter.startsWith('Chapter')
                                    ? lastest_chapter
                                    : 'Updating',
                                genres: genres !== lastest_chapter ? genres.split(',') : 'Updating',
                                authors: authors === 'Đang cập nhật' ? 'Updating' : authors.split(' - '),
                            };
                        });
                        return [2 /*return*/, suggestions];
                    case 2:
                        err_21 = _a.sent();
                        throw err_21;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.searchComics = function (query, page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics("tim-truyen?keyword=".concat(query.trim().replace(/\s+/g, '+')), page)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_22 = _a.sent();
                        throw err_22;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ComicsApi;
}());
var Comics = new ComicsApi();
exports.Comics = Comics;
