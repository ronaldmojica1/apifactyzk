"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class Medico extends sequelize_1.Model {
}
Medico.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    nit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    docIdentificacion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'Medico',
    tableName: 'medico',
});
exports.default = Medico;
