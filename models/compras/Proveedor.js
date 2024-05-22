"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const ActividadEconomica_1 = __importDefault(require("../factura/ActividadEconomica"));
const Pais_1 = __importDefault(require("../region/Pais"));
const TipoPersona_1 = __importDefault(require("../factura/TipoPersona"));
const TipoDocumento_1 = __importDefault(require("../factura/TipoDocumento"));
const Departamento_1 = __importDefault(require("../region/Departamento"));
const Municipio_1 = __importDefault(require("../region/Municipio"));
class Proveedor extends sequelize_1.Model {
}
Proveedor.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    nrc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    tipoDocumentoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoDocumento_1.default,
            key: 'id'
        }
    },
    numDocumento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    actividadEconomicaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ActividadEconomica_1.default,
            key: 'id'
        }
    },
    nombreComercial: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    paisId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Pais_1.default,
            key: 'id'
        }
    },
    departamentoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Departamento_1.default,
            key: 'id'
        }
    },
    municipioId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Municipio_1.default,
            key: 'id'
        }
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    correo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    tipoPersonaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoPersona_1.default,
            key: 'id'
        }
    },
}, {
    sequelize: database_1.default,
    modelName: 'Proveedor',
    tableName: 'proveedor',
});
Proveedor.belongsTo(TipoDocumento_1.default, { foreignKey: 'tipoDocumentoId', as: 'tipoDocumento' });
Proveedor.belongsTo(ActividadEconomica_1.default, { foreignKey: 'actividadEconomicaId', as: 'actividadEconomica' });
Proveedor.belongsTo(Pais_1.default, { foreignKey: 'paisId', as: 'pais' });
Proveedor.belongsTo(Departamento_1.default, { foreignKey: 'departamentoId', as: 'departamento' });
Proveedor.belongsTo(Municipio_1.default, { foreignKey: 'municipioId', as: 'municipio' });
Proveedor.belongsTo(TipoPersona_1.default, { foreignKey: 'tipoPersonaId', as: 'tipoPersona' });
exports.default = Proveedor;
