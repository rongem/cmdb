"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSqlPool = getSqlPool;
exports.closeSqlPool = closeSqlPool;
const mssql_1 = __importDefault(require("mssql"));
const env_1 = require("../config/env");
let pool = null;
async function getSqlPool() {
    if (pool) {
        return pool;
    }
    try {
        pool = new mssql_1.default.ConnectionPool(env_1.env.DATABASE_URL);
        await pool.connect();
        return pool;
    }
    catch (error) {
        console.warn('SQL connection unavailable. Falling back to in-memory data.', error instanceof Error ? error.message : error);
        pool = null;
        return null;
    }
}
async function closeSqlPool() {
    if (pool) {
        await pool.close();
        pool = null;
    }
}
