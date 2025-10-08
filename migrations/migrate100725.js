"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Migración del 07/10/2025
// Actualización de catálogos y datos base del sistema
const sequelize_1 = require("sequelize");
const TipoEstablecimiento_1 = __importDefault(require("../models/factura/TipoEstablecimiento"));
const Departamento_1 = __importDefault(require("../models/region/Departamento"));
const Municipio_1 = __importDefault(require("../models/region/Municipio"));
const UnidadMedida_1 = __importDefault(require("../models/inventario/UnidadMedida"));
const FormaPago_1 = __importDefault(require("../models/factura/FormaPago"));
const ActividadEconomica_1 = __importDefault(require("../models/factura/ActividadEconomica"));
const Pais_1 = __importDefault(require("../models/region/Pais"));
const RecintoFiscal_1 = __importDefault(require("../models/factura/RecintoFiscal"));
const ModoTransporte_1 = __importDefault(require("../models/factura/ModoTransporte"));
const Incoterms_1 = __importDefault(require("../models/factura/Incoterms"));
const database_1 = __importDefault(require("../config/database"));
const Migration_1 = __importDefault(require("../models/Migration"));
const MIGRATION_NAME = 'migrate100725';
const log = (message) => {
    console.log(`[MIGRATION 100725] ${new Date().toISOString()} - ${message}`);
};
const migrate = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Crear tabla de migraciones si no existe
        yield Migration_1.default.sync();
        // Verificar si la migración ya fue ejecutada
        const existingMigration = yield Migration_1.default.findOne({
            where: { name: MIGRATION_NAME }
        });
        if (existingMigration) {
            log(`Migración ${MIGRATION_NAME} ya fue ejecutada el ${existingMigration.executedAt.toISOString()}`);
            log("Proceso finalizado - migración omitida");
            return;
        }
        log("Iniciando migración...");
        // Paso 0: Crear el departamento para extranjeros ANTES de sincronizar municipios
        log("Verificando/creando departamento para extranjeros (código 00)...");
        const [deptoExtranjeros, created] = yield Departamento_1.default.findOrCreate({
            where: { codigo: '00' },
            defaults: { codigo: '00', departamento: 'Otro (Para Extranjeros)' }
        });
        if (created) {
            log(`Departamento creado con ID: ${deptoExtranjeros.id}`);
        }
        else {
            log(`Departamento ya existía con ID: ${deptoExtranjeros.id}`);
        }
        // Paso 1: Ejecutar todas las sincronizaciones de esquema (DDL operations)
        log("Sincronizando esquemas de tablas...");
        yield Municipio_1.default.sync({ alter: true });
        yield Pais_1.default.sync({ alter: true });
        yield UnidadMedida_1.default.sync({ alter: true });
        yield FormaPago_1.default.sync({ alter: true });
        log("Esquemas sincronizados correctamente");
        // Paso 2: Ejecutar todas las operaciones de datos dentro de una transacción
        const transaction = yield database_1.default.transaction();
        try {
            // 1. Eliminar tipo de establecimiento obsoleto
            log("Eliminando tipo de establecimiento código 20...");
            yield TipoEstablecimiento_1.default.destroy({
                where: { codigo: '20' },
                transaction
            });
            // 3. Actualizar municipios
            log("Inactivando municipios existentes (ID <= 262)...");
            yield Municipio_1.default.update({ activo: false }, { where: { id: { [sequelize_1.Op.lte]: 262 } }, transaction });
            log("Verificando e insertando nuevos municipios...");
            const municipio263 = yield Municipio_1.default.findByPk(263, { transaction });
            if (!municipio263) {
                const jsonFile = yield Promise.resolve().then(() => __importStar(require('../migrations/data/13-municipios.json')));
                // Ajustar el departamentoId del municipio "Otro (Para extranjeros)"
                // para que use el ID real del departamento código "00"
                const municipiosData = jsonFile.data.map((mun) => {
                    if (mun.codigo === '00' && mun.municipio === 'Otro (Para extranjeros)') {
                        return Object.assign(Object.assign({}, mun), { departamentoId: deptoExtranjeros.id });
                    }
                    return mun;
                });
                yield database_1.default.model("Municipio").bulkCreate(municipiosData, { transaction });
                log(`${municipiosData.length} municipios insertados`);
            }
            else {
                log("Municipios ya fueron insertados previamente");
            }
            // 4. Actualizar países
            log("Inactivando países existentes (ID <= 275)...");
            yield Pais_1.default.update({ activo: false }, { where: { id: { [sequelize_1.Op.lte]: 275 } }, transaction });
            log("Verificando e insertando nuevos países...");
            const pais276 = yield Pais_1.default.findByPk(276, { transaction });
            if (!pais276) {
                const jsonFile = yield Promise.resolve().then(() => __importStar(require('../migrations/data/20-paises.json')));
                yield database_1.default.model("Pais").bulkCreate(jsonFile.data, { transaction });
                log(`${jsonFile.data.length} países insertados`);
            }
            else {
                log("Países ya fueron insertados previamente");
            }
            // 5. Actualizar unidades de medida
            log("Activando todas las unidades de medida...");
            yield UnidadMedida_1.default.update({ activo: true }, { where: {}, transaction });
            log("Inactivando unidades de medida específicas...");
            yield UnidadMedida_1.default.update({ activo: false }, { where: { codigo: { [sequelize_1.Op.between]: [3, 5] } }, transaction });
            yield UnidadMedida_1.default.update({ activo: false }, { where: { codigo: 8 }, transaction });
            yield UnidadMedida_1.default.update({ activo: false }, { where: { codigo: { [sequelize_1.Op.in]: [11, 12, 14, 16, 17, 19, 21] } }, transaction });
            yield UnidadMedida_1.default.update({ activo: false }, { where: { codigo: { [sequelize_1.Op.in]: [25, 27, 28, 29, 31, 35] } }, transaction });
            // 6. Actualizar formas de pago
            log("Activando todas las formas de pago...");
            yield FormaPago_1.default.update({ activo: true }, { where: {}, transaction });
            log("Inactivando formas de pago 06 y 10...");
            yield FormaPago_1.default.update({ activo: false }, { where: { codigo: { [sequelize_1.Op.in]: ['06', '10'] } }, transaction });
            // 7. Insertar nueva actividad económica
            log("Insertando actividad económica 'Comerciante' (10006)...");
            yield ActividadEconomica_1.default.findOrCreate({
                where: { codigo: '10006' },
                defaults: { codigo: '10006', actividad: 'Comerciante' },
                transaction
            });
            // 8. Insertar nuevo recinto fiscal
            log("Insertando recinto fiscal 'Gutierrez Courier y Cargo' (85)...");
            yield RecintoFiscal_1.default.findOrCreate({
                where: { codigo: '85' },
                defaults: { codigo: '85', recinto: 'Gutierrez Courier y Cargo' },
                transaction
            });
            // 9. Actualizar modos de transporte
            log("Actualizando modos de transporte...");
            yield ModoTransporte_1.default.update({ modo: 'Aéreo' }, { where: { codigo: '2' }, transaction });
            yield ModoTransporte_1.default.update({ modo: 'Marítimo' }, { where: { codigo: '3' }, transaction });
            yield ModoTransporte_1.default.update({ modo: 'Ferreo' }, { where: { codigo: '4' }, transaction });
            yield ModoTransporte_1.default.update({ modo: 'Multimodal' }, { where: { codigo: '5' }, transaction });
            yield ModoTransporte_1.default.update({ modo: 'Correo' }, { where: { codigo: '6' }, transaction });
            log("Eliminando modo de transporte código 7...");
            yield ModoTransporte_1.default.destroy({
                where: { codigo: '7' },
                transaction
            });
            // 10. Eliminar incoterms obsoletos
            log("Eliminando incoterms códigos 11-16...");
            yield Incoterms_1.default.destroy({
                where: { codigo: { [sequelize_1.Op.between]: ['11', '16'] } },
                transaction
            });
            yield transaction.commit();
            log("Migración de datos completada exitosamente");
            // Registrar migración como ejecutada
            yield Migration_1.default.create({ name: MIGRATION_NAME });
            log(`Migración ${MIGRATION_NAME} registrada como completada`);
        }
        catch (error) {
            yield transaction.rollback();
            log(`ERROR en transacción: ${error instanceof Error ? error.message : String(error)}`);
            throw error;
        }
    }
    catch (error) {
        log(`ERROR FATAL: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
});
migrate()
    .then(() => {
    log("Proceso finalizado");
    process.exit(0);
})
    .catch((error) => {
    log(`Migración falló: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
});
