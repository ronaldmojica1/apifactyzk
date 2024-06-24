"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Producto_1 = __importDefault(require("../inventario/Producto"));
const UnidadMedida_1 = __importDefault(require("../inventario/UnidadMedida"));
const OrdenCompra_1 = __importDefault(require("./OrdenCompra"));
class OrdenCompraDetalle extends sequelize_1.Model {
}
OrdenCompraDetalle.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ordenCompraId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: OrdenCompra_1.default,
            key: 'id'
        }
    },
    productoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Producto_1.default,
            key: 'id'
        }
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    unidadMedidaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UnidadMedida_1.default,
            key: 'id'
        }
    },
    cantidad: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    precioUni: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    subTotal: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    observaciones: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    modelName: 'OrdenCompraDetalle',
    tableName: 'orden_compra_detalle',
});
OrdenCompraDetalle.belongsTo(Producto_1.default, { foreignKey: 'productoId', as: 'producto' });
OrdenCompraDetalle.belongsTo(UnidadMedida_1.default, { foreignKey: 'unidadMedidaId', as: 'unidadMedida' });
exports.default = OrdenCompraDetalle;
