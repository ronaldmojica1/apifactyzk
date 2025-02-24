"use strict";
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
const Dte_1 = __importDefault(require("../../models/factura/Dte"));
const apiresponse_1 = require("../../config/apiresponse");
const Emisor_1 = __importDefault(require("../../models/factura/Emisor"));
const TipoItem_1 = __importDefault(require("../../models/inventario/TipoItem"));
const Regimen_1 = __importDefault(require("../../models/factura/Regimen"));
const Receptor_1 = __importDefault(require("../../models/factura/Receptor"));
const TipoDte_1 = __importDefault(require("../../models/factura/TipoDte"));
const Ambiente_1 = __importDefault(require("../../models/factura/Ambiente"));
const TipoModelo_1 = __importDefault(require("../../models/factura/TipoModelo"));
const TipoOperacion_1 = __importDefault(require("../../models/factura/TipoOperacion"));
const TipoContingencia_1 = __importDefault(require("../../models/factura/TipoContingencia"));
const sequelize_1 = require("sequelize");
const RecintoFiscal_1 = __importDefault(require("../../models/factura/RecintoFiscal"));
const CondicionOperacions_1 = __importDefault(require("../../models/factura/CondicionOperacions"));
const Incoterms_1 = __importDefault(require("../../models/factura/Incoterms"));
const CuerpoDocumento_1 = __importDefault(require("../../models/factura/CuerpoDocumento"));
const DocumentosRelacionados_1 = __importDefault(require("../../models/factura/DocumentosRelacionados"));
const OtrosDocumentos_1 = __importDefault(require("../../models/factura/OtrosDocumentos"));
const PagoDte_1 = __importDefault(require("../../models/factura/PagoDte"));
const Apendice_1 = __importDefault(require("../../models/factura/Apendice"));
const Producto_1 = __importDefault(require("../../models/inventario/Producto"));
const UnidadMedida_1 = __importDefault(require("../../models/inventario/UnidadMedida"));
const TipoGeneracion_1 = __importDefault(require("../../models/factura/TipoGeneracion"));
const DocumentoAsociado_1 = __importDefault(require("../../models/factura/DocumentoAsociado"));
const ModoTransporte_1 = __importDefault(require("../../models/factura/ModoTransporte"));
const Medico_1 = __importDefault(require("../../models/factura/Medico"));
const TipoServicioMedico_1 = __importDefault(require("../../models/factura/TipoServicioMedico"));
const FormaPago_1 = __importDefault(require("../../models/factura/FormaPago"));
const Plazo_1 = __importDefault(require("../../models/factura/Plazo"));
const TipoVenta_1 = __importDefault(require("../../models/inventario/TipoVenta"));
const TributosItem_1 = __importDefault(require("../../models/factura/TributosItem"));
const ActividadEconomica_1 = __importDefault(require("../../models/factura/ActividadEconomica"));
const Tributo_1 = __importDefault(require("../../models/inventario/Tributo"));
const Usuario_1 = __importDefault(require("../../models/auth/Usuario"));
const NodeMailerController_1 = require("../correo/NodeMailerController");
const DteMhController_1 = __importDefault(require("../dte/DteMhController"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const { v4: uuidv4 } = require('uuid');
function getAllR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { desde, hasta, pndContingencia, creaDesde, creaHasta, tipoDte, emisor, cliente } = req.query;
            const whereOptions = {};
            if (creaDesde && creaHasta) {
                whereOptions.createdAt = {
                    [sequelize_1.Op.between]: [creaDesde + "T00:00:00", creaHasta + "T00:00:00"]
                };
            }
            if (desde && hasta) {
                whereOptions.fecEmi = {
                    [sequelize_1.Op.between]: [desde, hasta]
                };
            }
            if (pndContingencia) { //Si el querie marca que solicita los pendientes de contingencia
                whereOptions.selloRecibido = null;
                whereOptions.tipoContingenciaId = null;
            }
            if (tipoDte) {
                whereOptions.tipoDteId = {
                    [sequelize_1.Op.or]: tipoDte.split(",")
                };
            }
            if (emisor) {
                whereOptions.emisorId = {
                    [sequelize_1.Op.or]: emisor.split(",")
                };
            }
            if (cliente) {
                whereOptions.receptorId = {
                    [sequelize_1.Op.or]: cliente.split(",")
                };
            }
            const acts = yield Dte_1.default.findAll({
                where: whereOptions,
                include: [
                    {
                        model: Emisor_1.default,
                        as: 'emisor'
                    },
                    {
                        model: TipoItem_1.default,
                        as: 'tipoItemExpo'
                    },
                    {
                        model: Regimen_1.default,
                        as: 'regimen'
                    },
                    {
                        model: RecintoFiscal_1.default,
                        as: 'recintoFiscal'
                    },
                    {
                        model: Incoterms_1.default,
                        as: 'incoterm'
                    },
                    {
                        model: Receptor_1.default,
                        as: 'receptor'
                    },
                    {
                        model: TipoDte_1.default,
                        as: 'tipoDte'
                    },
                    {
                        model: Ambiente_1.default,
                        as: 'ambiente'
                    },
                    {
                        model: TipoModelo_1.default,
                        as: 'tipoModelo'
                    },
                    {
                        model: TipoOperacion_1.default,
                        as: 'tipoOperacion'
                    },
                    {
                        model: TipoContingencia_1.default,
                        as: 'tipoContingencia'
                    },
                    {
                        model: CondicionOperacions_1.default,
                        as: 'condicionOperacion'
                    },
                    {
                        model: Usuario_1.default,
                        as: 'creadoPor'
                    },
                    {
                        model: Usuario_1.default,
                        as: 'transmitidoPor'
                    }
                ],
                order: [['id', 'DESC']]
            });
            res.status(201).json((0, apiresponse_1.successResponse)(acts, ''));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al obtener'));
        }
    });
}
function createR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            req.body.codigoGeneracion = uuidv4().toUpperCase();
            req.body.creadoPorId = req.user.id;
            const act = yield Dte_1.default.create(req.body);
            //Agregar el detalle(Cuerpo Documento)
            const itemsLst = req.body.items;
            if (itemsLst != undefined) {
                itemsLst.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    item.dteId = act.id;
                    const actItm = yield CuerpoDocumento_1.default.create(item);
                    //guardar los tributos del item
                    const tribLst = item.tributos;
                    if (tribLst != undefined) {
                        tribLst.forEach((trib) => __awaiter(this, void 0, void 0, function* () {
                            trib.dteId = act.id;
                            trib.itemId = actItm.id;
                            yield TributosItem_1.default.create(trib);
                        }));
                    }
                }));
            }
            //Agregar Documentos Relacionados
            let docsRelLst = req.body.docsRel;
            if (docsRelLst != undefined) {
                docsRelLst.forEach((doc) => __awaiter(this, void 0, void 0, function* () {
                    doc.dteId = act.id;
                    yield DocumentosRelacionados_1.default.create(doc);
                }));
            }
            //Agregar Otros Documentos
            let otrosDocLst = req.body.otrosDoc;
            if (otrosDocLst != undefined) {
                otrosDocLst.forEach((doc) => __awaiter(this, void 0, void 0, function* () {
                    doc.dteId = act.id;
                    yield OtrosDocumentos_1.default.create(doc);
                }));
            }
            //Agregar informacion de Pago
            let pagoInfo = req.body.pagoInfo;
            if (pagoInfo != undefined) {
                pagoInfo.forEach((pago) => __awaiter(this, void 0, void 0, function* () {
                    pago.dteId = act.id;
                    yield PagoDte_1.default.create(pago);
                }));
            }
            //Agregar Apendice
            let apendiceInfo = req.body.apendice;
            if (apendiceInfo != undefined) {
                apendiceInfo.forEach((apen) => __awaiter(this, void 0, void 0, function* () {
                    apen.dteId = act.id;
                    yield Apendice_1.default.create(apen);
                }));
            }
            res.status(201).json((0, apiresponse_1.successResponse)(act, 'Creado con exito!'));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al crear '));
        }
    });
}
function updateR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Dte_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            yield act.update(req.body);
            //Actualizar el detalle (Cuerpo documento)
            let itemsLst = req.body.items;
            if (itemsLst != undefined) {
                itemsLst.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                    //Verificar si tiene confirmacion
                    if (item.confirmacion == 'Eliminado') {
                        yield CuerpoDocumento_1.default.findByPk(item.id).then((itm) => itm === null || itm === void 0 ? void 0 : itm.destroy());
                    }
                    else if (item.confirmacion == 'Agregado') {
                        item.dteId = act.id;
                        const actItm = yield CuerpoDocumento_1.default.create(item);
                        //guardar los tributos del item
                        const tribLst = item.tributos;
                        if (tribLst != undefined) {
                            tribLst.forEach((trib) => __awaiter(this, void 0, void 0, function* () {
                                trib.dteId = act.id;
                                trib.itemId = actItm.id;
                                yield TributosItem_1.default.create(trib);
                            }));
                        }
                    }
                    else {
                        yield CuerpoDocumento_1.default.findByPk(item.id).then((itm) => itm === null || itm === void 0 ? void 0 : itm.update(item));
                    }
                }));
            }
            //Actualizar Documentos Relacionados
            let docsRelLst = req.body.docsRel;
            if (docsRelLst != undefined) {
                docsRelLst.forEach((doc) => __awaiter(this, void 0, void 0, function* () {
                    //verificar si tiene confirmacion
                    if (doc.confirmacion == 'Eliminado') {
                        yield DocumentosRelacionados_1.default.findByPk(doc.id).then((d) => d === null || d === void 0 ? void 0 : d.destroy());
                    }
                    else if (doc.confirmacion == 'Agregado') {
                        doc.dteId = act.id;
                        yield DocumentosRelacionados_1.default.create(doc);
                    }
                    else {
                        yield DocumentosRelacionados_1.default.findByPk(doc.id).then((d) => d === null || d === void 0 ? void 0 : d.update(doc));
                    }
                }));
            }
            //Actualizar Otros Documentos
            let otrosDocLst = req.body.otrosDoc;
            if (otrosDocLst != undefined) {
                otrosDocLst.forEach((doc) => __awaiter(this, void 0, void 0, function* () {
                    //verificar si tiene confirmacion
                    if (doc.confirmacion == 'Eliminado') {
                        yield OtrosDocumentos_1.default.findByPk(doc.id).then((d) => d === null || d === void 0 ? void 0 : d.destroy());
                    }
                    else if (doc.confirmacion == 'Agregado') {
                        doc.dteId = act.id;
                        yield OtrosDocumentos_1.default.create(doc);
                    }
                    else {
                        yield OtrosDocumentos_1.default.findByPk(doc.id).then((d) => d === null || d === void 0 ? void 0 : d.update(doc));
                    }
                }));
            }
            //Actualizar informacion de Pago
            let pagoInfo = req.body.pagoInfo;
            if (pagoInfo != undefined) {
                pagoInfo.forEach((pago) => __awaiter(this, void 0, void 0, function* () {
                    //verificar si tiene confirmacion
                    if (pago.confirmacion == 'Eliminado') {
                        yield PagoDte_1.default.findByPk(pago.id).then((p) => p === null || p === void 0 ? void 0 : p.destroy());
                    }
                    else if (pago.confirmacion == 'Agregado') {
                        pago.dteId = act.id;
                        yield PagoDte_1.default.create(pago);
                    }
                    else {
                        yield PagoDte_1.default.findByPk(pago.id).then((p) => p === null || p === void 0 ? void 0 : p.update(pago));
                    }
                }));
            }
            //Actualizar Apendice
            let apendiceInfo = req.body.apendice;
            if (apendiceInfo != undefined) {
                apendiceInfo.forEach((apen) => __awaiter(this, void 0, void 0, function* () {
                    //verificar confirmacion
                    if (apen.confirmacion == 'Eliminado') {
                        yield Apendice_1.default.findByPk(apen.id).then((a) => a === null || a === void 0 ? void 0 : a.destroy());
                    }
                    else if (apen.confirmacion == 'Agregado') {
                        apen.dteId = act.id;
                        yield Apendice_1.default.create(apen);
                    }
                    else {
                        yield Apendice_1.default.findByPk(apen.id).then((a) => a === null || a === void 0 ? void 0 : a.update(apen));
                    }
                }));
            }
            res.json((0, apiresponse_1.successResponse)(act, 'Actualizado con exito'));
        }
        catch (error) {
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al eliminar'));
        }
    });
}
function deleteR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Dte_1.default.findByPk(req.params.id);
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //eliminar los tributos del item
            yield TributosItem_1.default.destroy({
                where: {
                    dteId: req.params.id
                }
            });
            //Eliminar el detalle
            yield CuerpoDocumento_1.default.destroy({
                where: {
                    dteId: req.params.id
                }
            });
            //Eliminar los documentos relacionados
            DocumentosRelacionados_1.default.destroy({
                where: {
                    dteId: req.params.id
                }
            });
            //Eliminar otros documentos
            OtrosDocumentos_1.default.destroy({
                where: {
                    dteId: req.params.id
                }
            });
            //Eliminar informacion de pago
            PagoDte_1.default.destroy({
                where: {
                    dteId: req.params.id
                }
            });
            //Eliminar apendice
            Apendice_1.default.destroy({
                where: {
                    dteId: req.params.id
                }
            });
            //Eliminar
            yield act.destroy();
            res.json((0, apiresponse_1.successResponse)(act, 'Eliminado con exito!'));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al eliminar'));
        }
    });
}
function getR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const act = yield Dte_1.default.findByPk(req.params.id, {
                include: [
                    {
                        model: Emisor_1.default,
                        as: 'emisor',
                        include: [
                            {
                                model: ActividadEconomica_1.default,
                                as: 'actividadEconomica'
                            }
                        ]
                    },
                    {
                        model: TipoItem_1.default,
                        as: 'tipoItemExpo'
                    },
                    {
                        model: Regimen_1.default,
                        as: 'regimen'
                    },
                    {
                        model: RecintoFiscal_1.default,
                        as: 'recintoFiscal'
                    },
                    {
                        model: Incoterms_1.default,
                        as: 'incoterm'
                    },
                    {
                        model: Receptor_1.default,
                        as: 'receptor'
                    },
                    {
                        model: Receptor_1.default,
                        as: 'cobrarA'
                    },
                    {
                        model: Receptor_1.default,
                        as: 'embarcarA'
                    },
                    {
                        model: TipoDte_1.default,
                        as: 'tipoDte'
                    },
                    {
                        model: Ambiente_1.default,
                        as: 'ambiente'
                    },
                    {
                        model: TipoModelo_1.default,
                        as: 'tipoModelo'
                    },
                    {
                        model: TipoOperacion_1.default,
                        as: 'tipoOperacion'
                    },
                    {
                        model: TipoContingencia_1.default,
                        as: 'tipoContingencia'
                    },
                    {
                        model: CondicionOperacions_1.default,
                        as: 'condicionOperacion'
                    },
                    {
                        model: CuerpoDocumento_1.default,
                        as: 'items',
                        separate: true,
                        order: [['numItem', 'ASC']],
                        include: [
                            {
                                model: Producto_1.default,
                                as: 'producto',
                            },
                            {
                                model: UnidadMedida_1.default,
                                as: 'unidadMedida'
                            },
                            {
                                model: TipoItem_1.default,
                                as: 'tipoItem'
                            },
                            {
                                model: TipoVenta_1.default,
                                as: 'tipoVenta'
                            },
                            {
                                model: TributosItem_1.default,
                                as: 'tributos',
                                include: [
                                    {
                                        model: Tributo_1.default,
                                        as: 'tributo'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: DocumentosRelacionados_1.default,
                        as: 'docsRel',
                        include: [
                            {
                                model: TipoDte_1.default,
                                as: 'tipoDte'
                            },
                            {
                                model: TipoGeneracion_1.default,
                                as: 'tipoGeneracion'
                            }
                        ]
                    },
                    {
                        model: OtrosDocumentos_1.default,
                        as: 'otrosDoc',
                        include: [
                            {
                                model: DocumentoAsociado_1.default,
                                as: 'documentoAsociado'
                            },
                            {
                                model: ModoTransporte_1.default,
                                as: 'modoTransporte'
                            },
                            {
                                model: Medico_1.default,
                                as: 'medico'
                            },
                            {
                                model: TipoServicioMedico_1.default,
                                as: 'tipoServicio'
                            }
                        ]
                    },
                    {
                        model: PagoDte_1.default,
                        as: 'pagoInfo',
                        include: [
                            {
                                model: FormaPago_1.default,
                                as: 'formaPago'
                            },
                            {
                                model: Plazo_1.default,
                                as: 'plazo'
                            }
                        ]
                    },
                    {
                        model: Apendice_1.default,
                        as: 'apendice'
                    }
                ]
            });
            if (!act) {
                res.status(200).json((0, apiresponse_1.notFoundResponse)('No encontrado'));
                return;
            }
            //Ver
            res.json((0, apiresponse_1.successResponse)(act, ''));
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al buscar'));
        }
    });
}
function enviarDocsCorreo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Obtener el DTE
            const dte = yield Dte_1.default.findByPk(req.body.dteId);
            if (dte) {
                //Descargar el json            
                const urlLista = (process.env.MH_CONSULTA_JSON || "");
                let tkn = yield DteMhController_1.default.obtenerToken();
                let docJson;
                yield axios_1.default.post(urlLista, {
                    codigoGeneracion: dte.codigoGeneracion,
                    tipoRpt: "E"
                }, {
                    headers: {
                        "Authorization": tkn
                    }
                }).then((result) => {
                    //console.log(result.data.body[0].documento)
                    docJson = result.data.body[0].documento;
                    docJson['selloRecibido'] = result.data.body[0].selloRecibido;
                    docJson['firma'] = result.data.body[0].firma;
                });
                //guardar el json
                const filePath = 'uploads/' + dte.codigoGeneracion + '.json';
                const jsonString = JSON.stringify(docJson, null, 2);
                fs_1.default.writeFile(filePath, jsonString, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
                //Obtener la plantilla del correo
                //const plantillaCorreo = await Correo.findByPk(1);
                const attachments = [
                    'uploads/' + dte.codigoGeneracion + '.pdf',
                    'uploads/' + dte.codigoGeneracion + '.json'
                ];
                const mailResStr = yield (0, NodeMailerController_1.sendEmail)(req.body.from, req.body.to, req.body.subject, req.body.text, attachments);
                res.json((0, apiresponse_1.successResponse)(null, mailResStr));
            }
            else {
                res.status(200).json((0, apiresponse_1.errorResponse)("Error al buscar DTE"));
            }
        }
        catch (error) {
            console.log(error);
            res.status(200).json((0, apiresponse_1.errorResponse)('Error al enviar'));
        }
    });
}
exports.default = {
    getAllR,
    createR,
    updateR,
    deleteR,
    getR,
    enviarDocsCorreo
};
