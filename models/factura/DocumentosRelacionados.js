"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Dte_1 = __importDefault(require("./Dte"));
const TipoDte_1 = __importDefault(require("./TipoDte"));
const TipoGeneracion_1 = __importDefault(require("./TipoGeneracion"));
class DocumentosRelacionados extends sequelize_1.Model {
}
DocumentosRelacionados.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dteId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Dte_1.default,
            key: 'id'
        }
    },
    tipoDteId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoDte_1.default,
            key: 'id'
        }
    },
    tipoGeneracionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoGeneracion_1.default,
            key: 'id'
        }
    },
    numeroDocumento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    fechaEmision: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize: database_1.default,
    modelName: 'DocumentosRelacionados',
    tableName: 'documentos_relacionados',
});
DocumentosRelacionados.belongsTo(TipoDte_1.default, { foreignKey: 'tipoDteId', as: 'tipoDte' });
DocumentosRelacionados.belongsTo(TipoGeneracion_1.default, { foreignKey: 'tipoGeneracionId', as: 'tipoGeneracion' });
exports.default = DocumentosRelacionados;
