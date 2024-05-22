"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const ActividadEconomica_1 = __importDefault(require("./ActividadEconomica"));
const TipoEstablecimiento_1 = __importDefault(require("./TipoEstablecimiento"));
const Departamento_1 = __importDefault(require("../region/Departamento"));
const Municipio_1 = __importDefault(require("../region/Municipio"));
const TipoDocumento_1 = __importDefault(require("./TipoDocumento"));
class Emisor extends sequelize_1.Model {
}
Emisor.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    referencia: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    nit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    nrc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    actividadEconomicaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ActividadEconomica_1.default,
            key: 'id'
        }
    },
    nombreComercial: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    tipoEstablecimientoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoEstablecimiento_1.default,
            key: 'id'
        }
    },
    departamentoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Departamento_1.default,
            key: 'id'
        }
    },
    municipioId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
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
        allowNull: false
    },
    correo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    codEstableMH: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    codEstable: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    codPuntoVentaMH: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    codPuntoVenta: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    nombreResponsable: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    tipoDocResponsableId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TipoDocumento_1.default,
            key: 'id'
        }
    },
    numeroDocResponsable: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize: database_1.default,
    modelName: 'Emisor',
    tableName: 'emisor',
});
Emisor.belongsTo(ActividadEconomica_1.default, { foreignKey: 'actividadEconomicaId', as: 'actividadEconomica' });
Emisor.belongsTo(TipoEstablecimiento_1.default, { foreignKey: 'tipoEstablecimientoId', as: 'tipoEstablecimiento' });
Emisor.belongsTo(Departamento_1.default, { foreignKey: 'departamentoId', as: 'departamento' });
Emisor.belongsTo(Municipio_1.default, { foreignKey: 'municipioId', as: 'municipio', onDelete: 'CASCADE' });
Emisor.belongsTo(TipoDocumento_1.default, { foreignKey: 'tipoDocResponsableId', as: 'tipoDocResponsable' });
exports.default = Emisor;
