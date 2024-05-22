"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const UnidadMedida_1 = __importDefault(require("../inventario/UnidadMedida"));
class UnidadMedidaH extends sequelize_1.Model {
}
UnidadMedidaH.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    unidadMedidaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UnidadMedida_1.default,
            key: 'id'
        }
    },
}, {
    sequelize: database_1.default,
    modelName: 'UnidadMedidaH',
    tableName: 'unidad_medida_h',
});
//sequelize.sync();
exports.default = UnidadMedidaH;
