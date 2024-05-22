"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class DomicilioFiscal extends sequelize_1.Model {
}
DomicilioFiscal.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    domicilio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'DomicilioFiscal',
    tableName: 'domicilio_fiscal',
});
//sequelize.sync();
exports.default = DomicilioFiscal;
