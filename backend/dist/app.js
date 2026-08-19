"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const env_1 = require("./config/env");
const request_context_1 = require("./middleware/request-context");
const auth_1 = require("./middleware/auth");
const configuration_items_route_1 = __importDefault(require("./routes/configuration-items.route"));
const item_attributes_route_1 = __importDefault(require("./routes/item-attributes.route"));
function createApp() {
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN, credentials: true }));
    app.use(express_1.default.json());
    app.use(request_context_1.requestContextMiddleware);
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', authMode: env_1.env.AUTH_MODE });
    });
    app.use(auth_1.authMiddleware);
    app.use('/api/v1', item_attributes_route_1.default);
    app.use('/api/v1/configuration-items', configuration_items_route_1.default);
    app.get('/api/v1/me', (req, res) => {
        res.json({ user: req.user ?? null });
    });
    app.use((err, _req, res, _next) => {
        if (err instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: 'Validation failed',
                errors: err.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            });
            return;
        }
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
    return app;
}
