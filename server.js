"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./version/v2/api"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
console.log('Environment:');
console.log('  NETTRUYEN_BASE_URL:', process.env.NETTRUYEN_BASE_URL || 'NOT SET');
console.log('  PORT:', PORT);
// Health check - no dependencies
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: {
            hasNettruyenUrl: !!process.env.NETTRUYEN_BASE_URL
        }
    });
});
app.get('/v2/hello', (req, res) => {
    res.json({ ok: true, message: 'v2 hello' });
});
// CORS middleware
app.use('/v2', (0, cors_1.default)({
    origin: ['https://webcomics-platforms.vercel.app', 'http://localhost:3000', 'http://localhost:8080'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}), api_1.default);
console.log('V2 router loaded, paths:', api_1.default.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path));
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
        path: req.path
    });
});
// Error handler - must have 4 parameters
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(status).json({
        status,
        message: process.env.NODE_ENV === 'production' && status === 500
            ? 'Internal server error'
            : message
    });
});
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
exports.default = app;
