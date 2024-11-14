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
const TipoDocumentoCompra_1 = __importDefault(require("./TipoDocumentoCompra"));
const ClaseDocumento_1 = __importDefault(require("./ClaseDocumento"));
const OrdenCompra_1 = __importDefault(require("./OrdenCompra"));
class Compra extends sequelize_1.Model {
}
Compra.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ordenCompraId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: OrdenCompra_1.default,
            key: 'id'
        }
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
    claseDocumentoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ClaseDocumento_1.default,
            key: 'id'
        }
    },
    tipoDocumentoCompraId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoDocumentoCompra_1.default,
            key: 'id'
        }
    },
    numeroDocumento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    fecEmi: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    horEmi: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    tipoMoneda: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'USD'
    },
    descuNoSuj: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    descuExenta: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    descuGravada: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    ivaRete1: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    ivaPerci1: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    reteRenta: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true
    },
    condicionOperacionId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: CondicionOperacions_1.default,
            key: 'id'
        }
    },
    numPagoElectronico: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
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
    modelName: 'Compra',
    tableName: 'compras',
});
Compra.belongsTo(OrdenCompra_1.default, { foreignKey: 'ordenCompraId', as: 'ordenCompra' });
Compra.belongsTo(Emisor_1.default, { foreignKey: 'sucursalId', as: 'sucursal' });
Compra.belongsTo(Proveedor_1.default, { foreignKey: 'proveedorId', as: 'proveedor' });
Compra.belongsTo(ClaseDocumento_1.default, { foreignKey: 'claseDocumentoId', as: 'claseDocumento' });
Compra.belongsTo(TipoDocumentoCompra_1.default, { foreignKey: 'tipoDocumentoCompraId', as: 'tipoDocumentoCompra' });
Compra.belongsTo(CondicionOperacions_1.default, { foreignKey: 'condicionOperacionId', as: 'condicionOperacion' });
Compra.belongsTo(Usuario_1.default, { foreignKey: 'creadoPorId', as: 'creadoPor' });
exports.default = Compra;
