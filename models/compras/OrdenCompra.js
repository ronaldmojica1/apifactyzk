"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Emisor_1 = __importDefault(require("../factura/Emisor"));
const CondicionOperacions_1 = __importDefault(require("../factura/CondicionOperacions"));
const Usuario_1 = __importDefault(require("../auth/Usuario"));
const Proveedor_1 = __importDefault(require("./Proveedor"));
class OrdenCompra extends sequelize_1.Model {
}
OrdenCompra.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    proveedorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Proveedor_1.default,
            key: 'id'
        }
    },
    sucursalId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Emisor_1.default,
            key: 'id'
        }
    },
    fecSoli: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    fecRequerida: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    tipoMoneda: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USD'
    },
    condicionOperacionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: CondicionOperacions_1.default,
            key: 'id'
        }
    },
    observaciones: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    creadoPorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Usuario_1.default,
            key: 'id'
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'OrdenCompra',
    tableName: 'orden_compra',
});
OrdenCompra.belongsTo(Emisor_1.default, { foreignKey: 'sucursalId', as: 'sucursal' });
OrdenCompra.belongsTo(Proveedor_1.default, { foreignKey: 'proveedorId', as: 'proveedor' });
OrdenCompra.belongsTo(CondicionOperacions_1.default, { foreignKey: 'condicionOperacionId', as: 'condicionOperacion' });
OrdenCompra.belongsTo(Usuario_1.default, { foreignKey: 'creadoPorId', as: 'creadoPor' });
exports.default = OrdenCompra;
