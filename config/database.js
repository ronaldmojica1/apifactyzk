"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv_1.default.config({ path: envFile });
const dbDialectString = process.env.DB_DIALECT;
let dialect;
dialect = dbDialectString;
//console.log("TEST DE ACTUALIZACION DE API")
const db = process.env.DB_NAME;
const usr = process.env.DB_USER;
const pwd = process.env.DB_PWD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const sequelize = new sequelize_1.Sequelize(db || 'apifact', usr || 'root', pwd || '', {
    host: host || 'localhost',
    dialect: dialect || 'postgres',
    port: parseInt(port || '5432'),
});
exports.default = sequelize;
