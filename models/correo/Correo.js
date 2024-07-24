"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class Correo extends sequelize_1.Model {
}
Correo.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    from: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    subject: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    text: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: database_1.default,
    modelName: 'Correo',
    tableName: 'correo',
});
//sequelize.sync();
exports.default = Correo;
