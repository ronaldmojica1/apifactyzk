"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const TipoItem_1 = __importDefault(require("./TipoItem"));
const Tributo_1 = __importDefault(require("./Tributo"));
const UnidadMedida_1 = __importDefault(require("./UnidadMedida"));
const TributosProducto_1 = __importDefault(require("./TributosProducto"));
const TipoVenta_1 = __importDefault(require("./TipoVenta"));
class Producto extends sequelize_1.Model {
}
Producto.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipoItemId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoItem_1.default,
            key: 'id'
        }
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    tributoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Tributo_1.default,
            key: 'id'
        }
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    unidadMedidaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UnidadMedida_1.default,
            key: 'id'
        }
    },
    precioCompra: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    precioUni: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    porcentajeDesc: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    psv: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    tipoVentaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoVenta_1.default,
            key: 'id'
        }
    }
}, {
    sequelize: database_1.default,
    modelName: 'Producto',
    tableName: 'producto',
});
Producto.hasMany(TributosProducto_1.default, { foreignKey: 'productoId', as: "tributos" });
Producto.belongsTo(TipoItem_1.default, { foreignKey: 'tipoItemId', as: 'tipoItem' });
Producto.belongsTo(Tributo_1.default, { foreignKey: 'tributoId', as: 'tributo' });
Producto.belongsTo(UnidadMedida_1.default, { foreignKey: 'unidadMedidaId', as: 'unidadMedida' });
Producto.belongsTo(TipoVenta_1.default, { foreignKey: 'tipoVentaId', as: 'tipoVenta' });
exports.default = Producto;
