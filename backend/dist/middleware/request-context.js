"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestContextMiddleware = requestContextMiddleware;
const request_id_1 = require("../utils/request-id");
function requestContextMiddleware(req, _res, next) {
    req.headers['x-request-id'] = String(req.headers['x-request-id'] ?? (0, request_id_1.createRequestId)());
    req.requestId = String(req.headers['x-request-id']);
    next();
}
