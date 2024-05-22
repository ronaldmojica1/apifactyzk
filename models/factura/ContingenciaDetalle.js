"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Dte_1 = __importDefault(require("./Dte"));
const Contingencia_1 = __importDefault(require("./Contingencia"));
class ContingenciaDetalle extends sequelize_1.Model {
}
ContingenciaDetalle.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    contingenciaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Contingencia_1.default,
            key: 'id'
        }
    },
    dteId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Dte_1.default,
            key: 'id'
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'ContingenciaDetalle',
    tableName: 'contingencia_detalle',
});
ContingenciaDetalle.belongsTo(Dte_1.default, { foreignKey: 'dteId', as: 'dte' });
exports.default = ContingenciaDetalle;
