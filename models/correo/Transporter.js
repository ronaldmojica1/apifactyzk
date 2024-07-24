"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class Transporter extends sequelize_1.Model {
}
Transporter.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    host: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    port: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    secure: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true
    },
    user: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    pass: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: database_1.default,
    modelName: 'Transporter',
    tableName: 'transporter',
});
//sequelize.sync();
exports.default = Transporter;
