"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Dte_1 = __importDefault(require("./Dte"));
const FormaPago_1 = __importDefault(require("./FormaPago"));
const Plazo_1 = __importDefault(require("./Plazo"));
class PagoDte extends sequelize_1.Model {
}
PagoDte.init({
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
    formaPagoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: FormaPago_1.default,
            key: 'id'
        }
    },
    montoPago: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    referencia: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    plazoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Plazo_1.default,
            key: 'id'
        }
    },
    periodo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize: database_1.default,
    modelName: 'PagoDte',
    tableName: 'pagos_dte',
});
PagoDte.belongsTo(FormaPago_1.default, { foreignKey: 'formaPagoId', as: 'formaPago' });
PagoDte.belongsTo(Plazo_1.default, { foreignKey: 'plazoId', as: 'plazo' });
exports.default = PagoDte;
