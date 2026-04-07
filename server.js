"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./version/v2/api"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// quick health route
app.get('/v2/hello', (req, res) => {
    res.json({ ok: true, message: 'v2 hello' });
});
// Version v2 only
app.use('/v2', (0, cors_1.default)({
    origin: ['https://webcomics-platforms.vercel.app'],
}), api_1.default);
console.log('V2 router paths:', api_1.default.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path));
// Handle 404
app.use((req, res) => {
    res.json({
        status: 404,
        message: 'Not Found',
    });
});
// @ts-ignore
app.use((err, req, res, next) => {
    const status = +(err.message.match(/\d+/) || 500);
    res.status(status).json({
        status,
        message: err.message,
    });
});
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
module.exports = app;
