"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class Tributo extends sequelize_1.Model {
}
Tributo.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    tributo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    seccion: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    porcentaje: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    valorPorUnidad: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    valorFijo: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    codDteAplica: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    modelName: 'Tributo',
    tableName: 'tributo',
});
//sequelize.sync();
exports.default = Tributo;
