"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const TipoDocumento_1 = __importDefault(require("./TipoDocumento"));
class ResponsableAnulacion extends sequelize_1.Model {
}
ResponsableAnulacion.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    tipoDocId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoDocumento_1.default,
            key: 'id'
        }
    },
    numDoc: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'ResponsableAnulacion',
    tableName: 'responsables_anulacion',
});
ResponsableAnulacion.belongsTo(TipoDocumento_1.default, { foreignKey: 'tipoDocId', as: 'tipoDocumento' });
exports.default = ResponsableAnulacion;
