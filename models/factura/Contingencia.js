"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const TipoContingencia_1 = __importDefault(require("./TipoContingencia"));
const Emisor_1 = __importDefault(require("./Emisor"));
const ContingenciaDetalle_1 = __importDefault(require("./ContingenciaDetalle"));
class Contingencia extends sequelize_1.Model {
}
Contingencia.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigoGeneracion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    fInicio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fFin: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    hInicio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    hFin: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    tipoContingenciaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoContingencia_1.default,
            key: 'id'
        }
    },
    motivoContingencia: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    emisorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Emisor_1.default,
            key: 'id'
        }
    },
    selloRecibido: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    codigoLote: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    loteEnviado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'Contingencia',
    tableName: 'contingencias',
});
Contingencia.belongsTo(TipoContingencia_1.default, { foreignKey: 'tipoContingenciaId', as: 'tipoContingencia' });
Contingencia.belongsTo(Emisor_1.default, { foreignKey: 'emisorId', as: 'emisor' });
Contingencia.hasMany(ContingenciaDetalle_1.default, { foreignKey: 'contingenciaId', as: 'detalle' });
exports.default = Contingencia;
