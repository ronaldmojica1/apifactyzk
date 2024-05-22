"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class TituloBien extends sequelize_1.Model {
}
TituloBien.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    titulo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'TituloBien',
    tableName: 'titulo_bien',
});
//sequelize.sync();
exports.default = TituloBien;
