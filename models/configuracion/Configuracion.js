"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
class Configuracion extends sequelize_1.Model {
}
Configuracion.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    usarLogo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    nombreLogo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    emisorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    modeloImpresora: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    modelName: 'Configuracion',
    tableName: 'configuraciones',
});
//Configuracion.sync({alter:true});
exports.default = Configuracion;
