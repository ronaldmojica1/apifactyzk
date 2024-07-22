"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Producto_1 = __importDefault(require("../inventario/Producto"));
const UnidadMedida_1 = __importDefault(require("../inventario/UnidadMedida"));
const Compra_1 = __importDefault(require("./Compra"));
const OrdenCompraDetalle_1 = __importDefault(require("./OrdenCompraDetalle"));
class CompraDetalle extends sequelize_1.Model {
}
CompraDetalle.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    compraId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Compra_1.default,
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
    ventaNoSuj: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    montoDescu: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    ventaExenta: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    ventaGravada: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    noGravado: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    ordenCompraDetalleId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: OrdenCompraDetalle_1.default,
            key: 'id'
        }
    },
    observaciones: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    pesoBruto: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    pesoNeto: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    marca: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    modelo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    serie: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    paisOrigen: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    lote: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    vencimiento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    modelName: 'CompraDetalle',
    tableName: 'compra_detalle',
});
CompraDetalle.belongsTo(Producto_1.default, { foreignKey: 'productoId', as: 'producto' });
CompraDetalle.belongsTo(UnidadMedida_1.default, { foreignKey: 'unidadMedidaId', as: 'unidadMedida' });
CompraDetalle.belongsTo(OrdenCompraDetalle_1.default, { foreignKey: 'ordenCompraDetalleId', as: 'ordenCompraDetalle' });
exports.default = CompraDetalle;
