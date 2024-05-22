"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Dte_1 = __importDefault(require("./Dte"));
const DocumentoAsociado_1 = __importDefault(require("./DocumentoAsociado"));
const ModoTransporte_1 = __importDefault(require("./ModoTransporte"));
const Medico_1 = __importDefault(require("./Medico"));
const TipoServicioMedico_1 = __importDefault(require("./TipoServicioMedico"));
class OtrosDocumentos extends sequelize_1.Model {
}
OtrosDocumentos.init({
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
    documentoAsociadoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DocumentoAsociado_1.default,
            key: 'id'
        }
    },
    descDocumento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    detalleDocumento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    placaTrans: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    modoTranspId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ModoTransporte_1.default,
            key: 'id'
        }
    },
    numConductor: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    nombreConductor: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    medicoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Medico_1.default,
            key: 'id'
        }
    },
    tipoServicioId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoServicioMedico_1.default,
            key: 'id'
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'OtrosDocumentos',
    tableName: 'otros_documentos',
});
OtrosDocumentos.belongsTo(DocumentoAsociado_1.default, { foreignKey: 'documentoAsociadoId', as: 'documentoAsociado' });
OtrosDocumentos.belongsTo(ModoTransporte_1.default, { foreignKey: 'modoTranspId', as: 'modoTransporte' });
OtrosDocumentos.belongsTo(Medico_1.default, { foreignKey: 'medicoId', as: 'medico' });
OtrosDocumentos.belongsTo(TipoServicioMedico_1.default, { foreignKey: 'tipoServicioId', as: 'tipoServicio' });
exports.default = OtrosDocumentos;
