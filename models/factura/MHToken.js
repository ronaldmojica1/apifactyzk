"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class MHToken extends sequelize_1.Model {
}
MHToken.init({
    jwt: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
}, {
    sequelize: database_1.default,
    modelName: 'MHToken',
    tableName: 'mh_token',
});
exports.default = MHToken;
