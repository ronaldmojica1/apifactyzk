"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class MHCredenciales extends sequelize_1.Model {
}
MHCredenciales.init({
    nit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    clave_api: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    clave_firma: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'MHCredenciales',
    tableName: 'mh_credenciales',
});
exports.default = MHCredenciales;
