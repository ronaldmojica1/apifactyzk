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
const pdf_lib_1 = require("pdf-lib");
const fs_1 = __importDefault(require("fs"));
const Dte_1 = __importDefault(require("../../../../models/factura/Dte"));
const Emisor_1 = __importDefault(require("../../../../models/factura/Emisor"));
const Receptor_1 = __importDefault(require("../../../../models/factura/Receptor"));
const CuerpoDocumento_1 = __importDefault(require("../../../../models/factura/CuerpoDocumento"));
const TributosItem_1 = __importDefault(require("../../../../models/factura/TributosItem"));
const Tributo_1 = __importDefault(require("../../../../models/inventario/Tributo"));
class Ccf {
    constructor(dte) {
        this.emisor = null;
        this.receptor = null;
        this.cuerpoDocumentos = [];
        this.tributos = [];
        this.dte = dte;
    }
    loadRelations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Load all necessary relations
                this.emisor = yield Emisor_1.default.findByPk(this.dte.emisorId);
                this.receptor = yield Receptor_1.default.findByPk(this.dte.receptorId);
                this.cuerpoDocumentos = yield CuerpoDocumento_1.default.findAll({ where: { dteId: this.dte.id } });
                this.tributos = yield TributosItem_1.default.findAll({ where: { dteId: this.dte.id } });
                return true;
            }
            catch (error) {
                console.error('Error loading relations:', error);
                return false;
            }
        });
    }
    generatePdf(outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Load relations if not already loaded
                if (!this.emisor || !this.receptor) {
                    const loaded = yield this.loadRelations();
                    if (!loaded)
                        return false;
                }
                // Create a new PDF document
                const pdfDoc = yield pdf_lib_1.PDFDocument.create();
                const page = pdfDoc.addPage([612, 792]); // Letter size
                // Get fonts
                const helveticaFont = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
                const helveticaBold = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
                // Set drawing parameters
                const { width, height } = page.getSize();
                const margin = 50;
                // Draw header
                const headerText = 'FAST CARGO S.A. DE C.V.';
                const headerTextWidth = helveticaBold.widthOfTextAtSize(headerText, 16);
                page.drawText(headerText, {
                    x: (width - headerTextWidth) / 2,
                    y: height - margin,
                    size: 16,
                    font: helveticaBold,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                });
                // Draw emisor information
                if (this.emisor) {
                    page.drawText(`Emisor: ${this.emisor.nombre}`, {
                        x: margin,
                        y: height - margin - 30,
                        size: 12,
                        font: helveticaFont,
                    });
                    page.drawText(`NIT: ${this.emisor.nit}`, {
                        x: margin,
                        y: height - margin - 45,
                        size: 10,
                        font: helveticaFont,
                    });
                    page.drawText(`Dirección: ${this.emisor.direccion}`, {
                        x: margin,
                        y: height - margin - 60,
                        size: 10,
                        font: helveticaFont,
                    });
                }
                // Draw document information
                page.drawText(`Código de Generación: ${this.dte.codigoGeneracion}`, {
                    x: width - margin - 200,
                    y: height - margin - 30,
                    size: 10,
                    font: helveticaFont,
                });
                page.drawText(`Fecha de Emisión: ${this.dte.fecEmi}`, {
                    x: width - margin - 200,
                    y: height - margin - 45,
                    size: 10,
                    font: helveticaFont,
                });
                // Draw receptor information
                if (this.receptor) {
                    page.drawText(`Cliente: ${this.receptor.nombre}`, {
                        x: margin,
                        y: height - margin - 90,
                        size: 12,
                        font: helveticaFont,
                    });
                    page.drawText(`NIT/DUI: ${this.receptor.nit}`, {
                        x: margin,
                        y: height - margin - 105,
                        size: 10,
                        font: helveticaFont,
                    });
                    page.drawText(`Dirección: ${this.receptor.direccion}`, {
                        x: margin,
                        y: height - margin - 120,
                        size: 10,
                        font: helveticaFont,
                    });
                }
                // Draw table header
                const tableTop = height - margin - 150;
                const colWidths = [40, 250, 70, 70, 80];
                const rowHeight = 20;
                // Draw table headers
                page.drawText('Cant.', {
                    x: margin,
                    y: tableTop,
                    size: 10,
                    font: helveticaBold,
                });
                page.drawText('Descripción', {
                    x: margin + colWidths[0],
                    y: tableTop,
                    size: 10,
                    font: helveticaBold,
                });
                page.drawText('Precio Unit.', {
                    x: margin + colWidths[0] + colWidths[1],
                    y: tableTop,
                    size: 10,
                    font: helveticaBold,
                });
                page.drawText('Ventas Exentas', {
                    x: margin + colWidths[0] + colWidths[1] + colWidths[2],
                    y: tableTop,
                    size: 10,
                    font: helveticaBold,
                });
                page.drawText('Ventas Afectas', {
                    x: margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                    y: tableTop,
                    size: 10,
                    font: helveticaBold,
                });
                // Draw horizontal line
                page.drawLine({
                    start: { x: margin, y: tableTop - 5 },
                    end: { x: width - margin, y: tableTop - 5 },
                    thickness: 1,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                });
                // Draw items
                let currentY = tableTop - rowHeight;
                let totalExento = 0;
                let totalGravado = 0;
                this.cuerpoDocumentos.forEach((item, index) => {
                    // Draw item data
                    page.drawText(item.cantidad.toString(), {
                        x: margin,
                        y: currentY,
                        size: 10,
                        font: helveticaFont,
                    });
                    // Handle long descriptions
                    const description = item.descripcion || '';
                    if (description.length > 40) {
                        const firstLine = description.substring(0, 40);
                        const secondLine = description.substring(40);
                        page.drawText(firstLine, {
                            x: margin + colWidths[0],
                            y: currentY,
                            size: 10,
                            font: helveticaFont,
                        });
                        currentY -= 15;
                        page.drawText(secondLine, {
                            x: margin + colWidths[0],
                            y: currentY,
                            size: 10,
                            font: helveticaFont,
                        });
                    }
                    else {
                        page.drawText(description, {
                            x: margin + colWidths[0],
                            y: currentY,
                            size: 10,
                            font: helveticaFont,
                        });
                    }
                    page.drawText(item.precioUni.toFixed(2), {
                        x: margin + colWidths[0] + colWidths[1],
                        y: currentY,
                        size: 10,
                        font: helveticaFont,
                    });
                    const exento = item.noGravado || 0;
                    const gravado = item.precioUni * item.cantidad - exento;
                    totalExento += exento;
                    totalGravado += gravado;
                    page.drawText(exento.toFixed(2), {
                        x: margin + colWidths[0] + colWidths[1] + colWidths[2],
                        y: currentY,
                        size: 10,
                        font: helveticaFont,
                    });
                    page.drawText(gravado.toFixed(2), {
                        x: margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                        y: currentY,
                        size: 10,
                        font: helveticaFont,
                    });
                    currentY -= rowHeight;
                });
                // Draw horizontal line
                page.drawLine({
                    start: { x: margin, y: currentY - 5 },
                    end: { x: width - margin, y: currentY - 5 },
                    thickness: 1,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                });
                // Draw totals
                currentY -= rowHeight;
                page.drawText('Sumas:', {
                    x: margin + colWidths[0] + colWidths[1],
                    y: currentY,
                    size: 10,
                    font: helveticaBold,
                });
                page.drawText(totalExento.toFixed(2), {
                    x: margin + colWidths[0] + colWidths[1] + colWidths[2],
                    y: currentY,
                    size: 10,
                    font: helveticaFont,
                });
                page.drawText(totalGravado.toFixed(2), {
                    x: margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                    y: currentY,
                    size: 10,
                    font: helveticaFont,
                });
                // Calculate IVA
                const iva = totalGravado * 0.13; // 13% IVA
                currentY -= rowHeight;
                page.drawText('IVA 13%:', {
                    x: margin + colWidths[0] + colWidths[1],
                    y: currentY,
                    size: 10,
                    font: helveticaBold,
                });
                page.drawText(iva.toFixed(2), {
                    x: margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                    y: currentY,
                    size: 10,
                    font: helveticaFont,
                });
                // Draw subtotal
                currentY -= rowHeight;
                page.drawText('Subtotal:', {
                    x: margin + colWidths[0] + colWidths[1],
                    y: currentY,
                    size: 10,
                    font: helveticaBold,
                });
                page.drawText((totalExento + totalGravado + iva).toFixed(2), {
                    x: margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                    y: currentY,
                    size: 10,
                    font: helveticaFont,
                });
                // Draw other taxes if any
                if (this.tributos.length > 0) {
                    this.tributos.forEach((tributo) => __awaiter(this, void 0, void 0, function* () {
                        currentY -= rowHeight;
                        const tributoItm = yield Tributo_1.default.findByPk(tributo.tributoId);
                        page.drawText(`${tributoItm === null || tributoItm === void 0 ? void 0 : tributoItm.tributo}:`, {
                            x: margin + colWidths[0] + colWidths[1],
                            y: currentY,
                            size: 10,
                            font: helveticaBold,
                        });
                        page.drawText(tributo.subTotal.toFixed(2), {
                            x: margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                            y: currentY,
                            size: 10,
                            font: helveticaFont,
                        });
                    }));
                }
                // Draw total
                currentY -= rowHeight;
                page.drawText('Total a Pagar:', {
                    x: margin + colWidths[0] + colWidths[1],
                    y: currentY,
                    size: 12,
                    font: helveticaBold,
                });
                // Calculate total including all taxes
                let totalTaxes = iva;
                this.tributos.forEach(tributo => {
                    totalTaxes += tributo.subTotal;
                });
                const grandTotal = totalExento + totalGravado + totalTaxes;
                page.drawText(grandTotal.toFixed(2), {
                    x: margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
                    y: currentY,
                    size: 12,
                    font: helveticaBold,
                });
                // Draw footer
                const footerY = 80;
                page.drawText('Observaciones:', {
                    x: margin,
                    y: footerY,
                    size: 10,
                    font: helveticaBold,
                });
                page.drawText(this.dte.observaciones || '', {
                    x: margin,
                    y: footerY - 15,
                    size: 10,
                    font: helveticaFont,
                });
                // Draw signature lines
                page.drawLine({
                    start: { x: margin, y: footerY - 50 },
                    end: { x: margin + 150, y: footerY - 50 },
                    thickness: 1,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                });
                page.drawText('Firma del Emisor', {
                    x: margin + 30,
                    y: footerY - 65,
                    size: 10,
                    font: helveticaFont,
                });
                page.drawLine({
                    start: { x: width - margin - 150, y: footerY - 50 },
                    end: { x: width - margin, y: footerY - 50 },
                    thickness: 1,
                    color: (0, pdf_lib_1.rgb)(0, 0, 0),
                });
                page.drawText('Firma del Cliente', {
                    x: width - margin - 120,
                    y: footerY - 65,
                    size: 10,
                    font: helveticaFont,
                });
                // Save the PDF
                const pdfBytes = yield pdfDoc.save();
                if (outputPath) {
                    fs_1.default.writeFileSync(outputPath, pdfBytes);
                    return true;
                }
                return Buffer.from(pdfBytes);
            }
            catch (error) {
                console.error('Error generating PDF:', error);
                return false;
            }
        });
    }
    // Static method to generate PDF from a DTE ID
    static generateFromDteId(dteId, outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dte = yield Dte_1.default.findByPk(dteId);
                if (!dte) {
                    throw new Error(`DTE with ID ${dteId} not found`);
                }
                const ccf = new Ccf(dte);
                return yield ccf.generatePdf(outputPath);
            }
            catch (error) {
                console.error('Error generating PDF from DTE ID:', error);
                return false;
            }
        });
    }
}
exports.default = Ccf;
