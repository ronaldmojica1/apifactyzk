"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class DocumentoAsociado extends sequelize_1.Model {
}
DocumentoAsociado.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    documento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'DocumentoAsociado',
    tableName: 'documento_asociado',
});
//sequelize.sync();
exports.default = DocumentoAsociado;
