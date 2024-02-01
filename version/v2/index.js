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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comics = void 0;
var axios_1 = require("axios");
var cheerio_1 = require("cheerio");
var random_useragent_1 = require("random-useragent");
var ComicsApi = /** @class */ (function () {
    function ComicsApi() {
        this.domain = 'https://www.nettruyen.com';
        this.agent = random_useragent_1.default.getRandom();
    }
    ComicsApi.prototype.createRequest = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.request({
                                method: 'GET',
                                url: "".concat(this.domain, "/").concat(path).replace(/\?+/g, '?'),
                                headers: {
                                    'User-Agent': this.agent,
                                },
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
    ComicsApi.prototype.getComicId = function (link) {
        var _a;
        if (!link)
            return '';
        return (_a = link === null || link === void 0 ? void 0 : link.match(/\/([^/]+)-\d+$/)) === null || _a === void 0 ? void 0 : _a[1];
    };
    ComicsApi.prototype.getGenreId = function (link) {
        var _a;
        if (!link)
            return '';
        return (_a = link === null || link === void 0 ? void 0 : link.match(/[^/]+$/)) === null || _a === void 0 ? void 0 : _a[0];
    };
    ComicsApi.prototype.formatTotal = function (total) {
        if (!total)
            return 0;
        return total === 'N/A' ? 'Updating' : Number(total === null || total === void 0 ? void 0 : total.replace(/\./g, ''));
    };
    ComicsApi.prototype.trim = function (text) {
        return text === null || text === void 0 ? void 0 : text.replace(/\n/g, '').trim();
    };
    ComicsApi.prototype.getComics = function (path, page, statusKey) {
        var _a, _b;
        if (page === void 0) { page = 1; }
        if (statusKey === void 0) { statusKey = 'all'; }
        return __awaiter(this, void 0, void 0, function () {
            var keys, status, _c, $_1, allGenres_1, total_pages, comics, err_2;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        keys = {
                            'Thể loại': 'genres',
                            'Tình trạng': 'status',
                            'Lượt xem': 'total_views',
                            'Bình luận': 'total_comments',
                            'Theo dõi': 'followers',
                            'Tên khác': 'other_names',
                            'Ngày cập nhật': 'updated_at',
                            'Tác giả': 'authors',
                        };
                        status = {
                            all: -1,
                            updating: 1,
                            completed: 2,
                        };
                        if (!status[statusKey])
                            throw Error('Invalid status');
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all([
                                this.createRequest(path.includes('tim-truyen')
                                    ? "".concat(path, "&status=").concat(status[statusKey], "&page=").concat(page)
                                    : "".concat(path + (path.includes('?') ? '&' : '?'), "page=").concat(page)),
                                this.getGenres(),
                            ])];
                    case 2:
                        _c = _d.sent(), $_1 = _c[0], allGenres_1 = _c[1];
                        total_pages = ((_b = (_a = $_1('a[title="Trang cuối"]')) === null || _a === void 0 ? void 0 : _a.attr('href')) === null || _b === void 0 ? void 0 : _b.split('=').at(-1)) ||
                            $_1('.pagination-outter li.active a').text() ||
                            1;
                        if (page > Number(total_pages)) {
                            return [2 /*return*/, { status: 404, message: 'Page not found' }];
                        }
                        comics = Array.from($_1('#ctl00_divCenter .item')).map(function (item) {
                            var thumbnail = 'https:' + $_1('.image img', item).attr('data-original');
                            var title = _this.trim($_1('figcaption h3', item).text());
                            var id = _this.getComicId($_1('a', item).attr('href'));
                            var is_trending = !!$_1('.icon-hot', item).toString();
                            var short_description = $_1('.box_text', item)
                                .text()
                                .replace(/-/g, '')
                                .replace(/\n/g, ' ');
                            var cols = Array.from($_1('.message_main p', item)).map(function (col) {
                                var _a;
                                var _b;
                                var _c = (_b = _this.trim($_1(col).text())) === null || _b === void 0 ? void 0 : _b.match(/^(.*?):(.*)$/), _ = _c[0], label = _c[1], detail = _c[2];
                                var value = /, |;\s*| - /.test(detail)
                                    ? detail.split(/, |;\s*| - /)
                                    : detail;
                                var key = keys[label];
                                if (key === 'genres') {
                                    var genresList = Array.isArray(value) ? value : [value];
                                    var genres = genresList.map(function (genre) {
                                        var foundGenre = allGenres_1.find(function (g) { return g.name === genre; });
                                        return { id: foundGenre === null || foundGenre === void 0 ? void 0 : foundGenre.id, name: foundGenre === null || foundGenre === void 0 ? void 0 : foundGenre.name };
                                    });
                                    return { genres: genres };
                                }
                                if (key === 'status') {
                                    return {
                                        status: value === 'Hoàn thành' ? 'Completed' : 'Ongoing',
                                    };
                                }
                                return _a = {},
                                    _a[key] = value,
                                    _a;
                            });
                            var lastest_chapters = Array.from($_1('.comic-item li', item)).map(function (chap) {
                                var id = Number($_1('a', chap).attr('data-id'));
                                var name = $_1('a', chap).text();
                                var updated_at = $_1('.time', chap).text();
                                return {
                                    id: id,
                                    name: name,
                                    updated_at: updated_at,
                                };
                            });
                            return Object.assign.apply(Object, __spreadArray([{},
                                {
                                    thumbnail: thumbnail,
                                    title: title,
                                    id: id,
                                    is_trending: is_trending,
                                    short_description: short_description,
                                    lastest_chapters: lastest_chapters,
                                    genres: [],
                                    other_names: [],
                                    status: 'Updating',
                                    total_views: 'Updating',
                                    total_comments: 'Updating',
                                    followers: 'Updating',
                                    updated_at: 'Updating',
                                    authors: 'Updating',
                                }], cols, false));
                        });
                        return [2 /*return*/, { comics: comics, total_pages: Number(total_pages), current_page: page }];
                    case 3:
                        err_2 = _d.sent();
                        throw err_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getChapters = function (comicId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var $, id, data, chapters, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.createRequest("truyen-tranh/".concat(comicId, "-1"))];
                    case 1:
                        $ = _b.sent();
                        id = $('.star').attr('data-id');
                        return [4 /*yield*/, axios_1.default.get("".concat(this.domain, "/Comic/Services/ComicService.asmx/ProcessChapterList?comicId=").concat(id), {
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
                        err_3 = _b.sent();
                        throw err_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getGenres = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $_2, genres, err_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createRequest('')];
                    case 1:
                        $_2 = _a.sent();
                        genres = Array.from($_2('#mainNav .clearfix li a')).map(function (item) {
                            var id = _this.getGenreId($_2(item).attr('href'));
                            var name = _this.trim($_2(item).text());
                            var description = $_2(item).attr('data-title');
                            return { id: id === 'tim-truyen' ? 'all' : id, name: name, description: description };
                        });
                        return [2 /*return*/, __spreadArray(__spreadArray([], genres, true), [
                                {
                                    id: '16',
                                    name: '16+',
                                    description: 'Là thể loại có nhiều cảnh nóng, đề cập đến các vấn đề nhạy cảm giới tính hay các cảnh bạo lực máu me .... Nói chung là truyện có tác động xấu đến tâm sinh lý của những độc giả chưa đủ 16 tuổi',
                                },
                            ], false)];
                    case 2:
                        err_4 = _a.sent();
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getRecommendComics = function (type) {
        if (type === void 0) { type = 'hot'; }
        return __awaiter(this, void 0, void 0, function () {
            var keys, $, comics;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = {
                            hot: 'hot',
                            boy: 'truyen-con-trai',
                            girl: 'truyen-con-gai',
                        };
                        return [4 /*yield*/, this.createRequest(keys[type])];
                    case 1:
                        $ = _a.sent();
                        comics = Array.from($('#ctl00_divAlt1 div.item')).map(function (item) {
                            var id = _this.getComicId($('a', item).attr('href'));
                            var title = $('a', item).attr('title');
                            var thumbnail = 'https:' + $('img', item).attr('data-src');
                            var updated_at = _this.trim($('.time', item).text());
                            var chapter_id = Number($('.slide-caption > a', item).attr('href').split('/').at(-1));
                            var name = $('.slide-caption > a', item).text();
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
    ComicsApi.prototype.getRecentUpdateComics = function (page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('', page)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_5 = _a.sent();
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getCompletedComics = function (page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('truyen-full', page)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_6 = _a.sent();
                        throw err_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getNewComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=15', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_7 = _a.sent();
                        throw err_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getComicsByGenre = function (genreId, page, status) {
        if (page === void 0) { page = 1; }
        if (status === void 0) { status = 'all'; }
        return __awaiter(this, void 0, void 0, function () {
            var path, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        path = genreId === 'all' ? 'tim-truyen?' : "tim-truyen/".concat(genreId, "?");
                        return [4 /*yield*/, this.getComics(path, page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_8 = _a.sent();
                        throw err_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopDailyComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=13', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_9 = _a.sent();
                        throw err_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopWeeklyComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=12', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_10 = _a.sent();
                        throw err_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopMonthlyComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=11', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_11 = _a.sent();
                        throw err_11;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopFollowComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=20', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_12 = _a.sent();
                        throw err_12;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopCommentComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=25', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_13 = _a.sent();
                        throw err_13;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopAllComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=10', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_14 = _a.sent();
                        throw err_14;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTopChapterComics = function (status, page) {
        if (status === void 0) { status = 'all'; }
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('tim-truyen?sort=30', page, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_15 = _a.sent();
                        throw err_15;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getTrendingComics = function (page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('hot?', page)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_16 = _a.sent();
                        throw err_16;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getBoyComics = function (page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('truyen-con-trai?', page)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_17 = _a.sent();
                        throw err_17;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getGirlComics = function (page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics('truyen-con-gai?', page)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_18 = _a.sent();
                        throw err_18;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.searchComics = function (query, page) {
        if (page === void 0) { page = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var err_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getComics("tim-truyen?keyword=".concat(query.replace(/\s+/g, '+'), "&"), page)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_19 = _a.sent();
                        throw err_19;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getComicDetail = function (comicId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, $_3, chapters, title, thumbnail, description, authors, status_1, genres, is_adult, other_names, total_views, rating_count, average, followers, err_20;
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
                        title = $_3('.title-detail').text();
                        thumbnail = 'https:' + $_3('#item-detail .col-image img').attr('src');
                        description = $_3('.detail-content p')
                            .text()
                            .replace(/\n/g, ' ')
                            .replace(/-/g, '')
                            .trim();
                        authors = $_3('.author p:nth-child(2)').text();
                        authors = /, |;\s*| - /.test(authors)
                            ? authors.split(/, |;\s*| - /)
                            : authors !== 'Đang cập nhật'
                                ? $_3('.author p:nth-child(2)').text()
                                : 'Updating';
                        status_1 = $_3('.status p:nth-child(2)').text() === 'Hoàn thành'
                            ? 'Finished'
                            : 'Ongoing';
                        genres = Array.from($_3('.kind p:nth-child(2) a')).map(function (item) {
                            var id = _this.getGenreId($_3(item).attr('href'));
                            var name = $_3(item).text();
                            return { id: id, name: name };
                        });
                        is_adult = !!$_3('.alert-danger').toString();
                        other_names = $_3('.other-name')
                            .text()
                            .split(/, |;| - /)
                            .map(function (x) { return x.trim(); });
                        total_views = this.formatTotal($_3('.list-info .row:last-child p:nth-child(2)').text());
                        rating_count = Number($_3('span[itemprop="ratingCount"]').text());
                        average = Number($_3('span[itemprop="ratingValue"]').text());
                        followers = this.formatTotal($_3('.follow b').text());
                        return [2 /*return*/, {
                                title: title,
                                thumbnail: thumbnail,
                                description: description,
                                authors: authors,
                                status: status_1,
                                genres: genres,
                                total_views: total_views,
                                average: average,
                                rating_count: rating_count,
                                followers: followers,
                                chapters: chapters,
                                id: comicId,
                                is_adult: is_adult,
                                other_names: other_names[0] !== '' ? other_names : [],
                            }];
                    case 2:
                        err_20 = _b.sent();
                        throw err_20;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getChapter = function (comicId, chapterId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, $_4, chapters, _b, _, cdn_1_1, cdn_2_1, images, chapter_name, comic_name, err_21;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                this.createRequest("truyen-tranh/".concat(comicId, "/chapter/").concat(chapterId)),
                                this.getChapters(comicId),
                            ])];
                    case 1:
                        _a = _c.sent(), $_4 = _a[0], chapters = _a[1];
                        _b = $_4('#ctl00_divCenter script')
                            .text()
                            .match(/gOpts\.cdn="(.*?)";.*?gOpts\.cdn2="(.*?)";/), _ = _b[0], cdn_1_1 = _b[1], cdn_2_1 = _b[2];
                        images = Array.from($_4('.page-chapter img')).map(function (img) {
                            var page = Number($_4(img).attr('data-index'));
                            var host = $_4(img)
                                .attr('src')
                                .match(/^\/\/([^/]+)/)[0];
                            var src = "/images?src=https:".concat($_4(img).attr('src'));
                            var backup_url_1 = cdn_1_1 ? src.replace(host, cdn_1_1) : '';
                            var backup_url_2 = cdn_2_1 ? src.replace(host, cdn_2_1) : '';
                            return { page: page, src: src, backup_url_1: backup_url_1, backup_url_2: backup_url_2 };
                        });
                        chapter_name = $_4('.breadcrumb li:last-child').first().text();
                        comic_name = $_4('.breadcrumb li:nth-last-child(2)').first().text();
                        return [2 /*return*/, { images: images, chapters: chapters, chapter_name: chapter_name, comic_name: comic_name }];
                    case 2:
                        err_21 = _c.sent();
                        throw err_21;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getComicsByAuthor = function (alias) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    return [2 /*return*/, this.getComics("/tim-truyen?tac-gia=".concat(alias.replace(/\s+/, '+')))];
                }
                catch (err) {
                    throw err;
                }
                return [2 /*return*/];
            });
        });
    };
    ComicsApi.prototype.getComments = function (comicId, page, chapterId) {
        if (page === void 0) { page = 1; }
        if (chapterId === void 0) { chapterId = -1; }
        return __awaiter(this, void 0, void 0, function () {
            var body, id_1, token_1, url, data, _a, main, backup, total_comments, $_5, total_pages, comments, err_22;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.createRequest("truyen-tranh/".concat(comicId, "-1"))];
                    case 1:
                        body = _b.sent();
                        id_1 = body('head meta[property="og:image"]')
                            .attr('content')
                            .match(/\/(\d+)\./)[1];
                        token_1 = body('#ctl00_divCenter > script')
                            .text()
                            .match(/'([^']+)'/)[1];
                        url = function (chapterId) {
                            return "".concat(_this.domain, "/Comic/Services/CommentService.asmx/List?comicId=").concat(id_1, "&orderBy=0&chapterId=").concat(chapterId, "&parentId=0&pageNumber=").concat(page, "&token=").concat(token_1);
                        };
                        data = void 0;
                        return [4 /*yield*/, Promise.all([
                                axios_1.default.get(url(chapterId), {
                                    headers: { 'User-Agent': this.agent },
                                }),
                                axios_1.default.get(url(-1), {
                                    headers: { 'User-Agent': this.agent },
                                }),
                            ])];
                    case 2:
                        _a = _b.sent(), main = _a[0], backup = _a[1];
                        if (main.data.success) {
                            data = main.data;
                        }
                        else if (backup.data.success) {
                            data = backup.data;
                        }
                        else {
                            return [2 /*return*/, {
                                    status: 400,
                                    message: 'Something went wrong!',
                                }];
                        }
                        total_comments = Number(data.commentCount.replace(',', ''));
                        $_5 = (0, cheerio_1.load)(data.response);
                        total_pages = Math.ceil(total_comments / 15);
                        if (page > total_pages) {
                            return [2 /*return*/, { status: 400, message: 'Invalid page' }];
                        }
                        comments = Array.from($_5('.clearfix')).map(function (item) {
                            var avatar = 'https:' + $_5('.avatar img', item).attr('src');
                            var username = $_5(item).find('.authorname').first().text().trim();
                            var content = $_5('.comment-content', item).first().text().trim();
                            var vote_count = $_5('.comment-footer .vote-up-count', item)
                                .first()
                                .text();
                            var stickers = Array.from($_5(item).find('> .summary > .info > .comment-content > img')).map(function (img) {
                                var _a, _b;
                                return (_b = (_a = $_5(img)
                                    .attr('src')) === null || _a === void 0 ? void 0 : _a.match(/url=(.*)$/)) === null || _b === void 0 ? void 0 : _b[1];
                            });
                            var created_at = $_5('.comment-footer abbr', item)
                                .first()
                                .attr('title');
                            var replies = Array.from($_5('.item', item)).map(function (reply) {
                                var avatar = 'https:' + $_5('.avatar img', reply).attr('src');
                                var username = $_5('.authorname', reply).text().trim();
                                var content = $_5('.comment-content', reply)
                                    .clone()
                                    .children()
                                    .remove()
                                    .end()
                                    .text()
                                    .trim();
                                var vote_count = $_5('.comment-footer .vote-up-count', reply).text();
                                var stickers = Array.from($_5('.comment-content > img', reply)).map(function (img) {
                                    var _a, _b;
                                    return (_b = (_a = $_5(img)
                                        .attr('src')) === null || _a === void 0 ? void 0 : _a.match(/url=(.*)$/)) === null || _b === void 0 ? void 0 : _b[1];
                                });
                                var created_at = $_5('.comment-footer abbr', reply).attr('title');
                                var mention_user = $_5('.mention-user', reply).text().trim();
                                return {
                                    avatar: avatar,
                                    username: username,
                                    content: content,
                                    stickers: stickers,
                                    created_at: created_at,
                                    vote_count: parseInt(vote_count),
                                    mention_user: mention_user,
                                };
                            });
                            return {
                                avatar: avatar,
                                username: username,
                                content: content,
                                stickers: stickers,
                                replies: replies,
                                created_at: created_at,
                                vote_count: parseInt(vote_count),
                            };
                        });
                        return [2 /*return*/, { comments: comments, total_comments: total_comments, total_pages: total_pages, current_page: page }];
                    case 3:
                        err_22 = _b.sent();
                        throw err_22;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ComicsApi.prototype.getSearchSuggest = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var data, $_6, suggestions, err_23;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = query.trim();
                        if (!query)
                            throw Error('Invalid query');
                        return [4 /*yield*/, axios_1.default.get("".concat(this.domain, "/Comic/Services/SuggestSearch.ashx?q=").concat(query), { headers: { 'User-Agent': this.agent } })];
                    case 1:
                        data = (_a.sent()).data;
                        $_6 = (0, cheerio_1.load)(data);
                        suggestions = Array.from($_6('li')).map(function (comic) {
                            var id = _this.getComicId($_6('a', comic).attr('href'));
                            var thumbnail = 'https:' + $_6('img', comic).attr('src');
                            var title = $_6('h3', comic).text();
                            var lastest_chapter = $_6('i', comic).first().text();
                            var genres = $_6('i', comic).last().text();
                            var authors = $_6('b', comic).text() || 'Updating';
                            return {
                                id: id,
                                title: title,
                                thumbnail: thumbnail,
                                lastest_chapter: lastest_chapter.startsWith('Chapter')
                                    ? lastest_chapter
                                    : 'Updating',
                                genres: genres !== lastest_chapter ? genres.split(', ') : 'Updating',
                                authors: authors === 'Updating' ? authors : authors.split(' - '),
                            };
                        });
                        return [2 /*return*/, suggestions];
                    case 2:
                        err_23 = _a.sent();
                        throw err_23;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ComicsApi;
}());
var Comics = new ComicsApi();
exports.Comics = Comics;
