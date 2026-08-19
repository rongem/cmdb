"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function authMiddleware(req, res, next) {
    if (env_1.env.AUTH_MODE === 'none') {
        req.user = {
            id: 'local-user',
            userName: 'local-dev',
            roles: ['admin'],
            authMode: 'none',
            tenantId: 'default',
        };
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const token = authHeader.replace('Bearer ', '');
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        req.user = {
            id: payload.sub ?? 'unknown-user',
            userName: payload.userName ?? 'unknown-user',
            roles: payload.roles ?? ['reader'],
            authMode: 'jwt',
            tenantId: payload.tenantId ?? 'default',
        };
        next();
    }
    catch {
        res.status(401).json({ message: 'Invalid token' });
    }
}
