"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class TipoItem extends sequelize_1.Model {
}
TipoItem.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    tipo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'TipoItem',
    tableName: 'tipo_item',
});
//sequelize.sync();
exports.default = TipoItem;
