"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class Usuario extends sequelize_1.Model {
}
Usuario.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    usuario: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    clave: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'Usuario',
    tableName: 'usuario',
});
//sequelize.sync();
exports.default = Usuario;
