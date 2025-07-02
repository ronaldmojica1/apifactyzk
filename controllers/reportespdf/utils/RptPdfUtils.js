"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = exports.Column = exports.colorGray = exports.colorBlack = exports.pdfConfig = void 0;
exports.initDocCreation = initDocCreation;
exports.splitTextAndGetHeight = splitTextAndGetHeight;
exports.getDocWidth = getDocWidth;
exports.getDocHeight = getDocHeight;
exports.calculateColumnWidth = calculateColumnWidth;
exports.renderRow = renderRow;
exports.renderGrid = renderGrid;
const jspdf_1 = __importDefault(require("jspdf"));
function initDocCreation(param) {
    const options = {
        orientation: param.orientationLandscape ? "landscape" : "portrait",
        compress: param.compress
    };
    let doc = new jspdf_1.default(options);
    return doc;
}
function splitTextAndGetHeight(text, size, doc) {
    const lines = doc.splitTextToSize(text, size);
    return {
        text: lines,
        height: doc.getTextDimensions(lines).h
    };
}
function getDocWidth(doc) {
    return doc.internal.pageSize.width;
}
function getDocHeight(doc) {
    return doc.internal.pageSize.height;
}
exports.pdfConfig = {
    headerTextSize: 10,
    labelTextSize: 9,
    fieldTextSize: 7.5,
    lineHeight: 6,
    subLineHeight: 4,
    // Adding grid configuration
    grid: {
        columns: 12, // Total columns in the grid (like Bootstrap's 12-column system)
        gutter: 5, // Space between columns in points
        defaultPadding: 3 // Default padding inside cells
    }
};
exports.colorBlack = "#000000";
exports.colorGray = "#4d4e53";
// Define una clase para las columnas
class Column {
    constructor(size, content, rows, style) {
        this.size = size;
        this.content = content;
        this.rows = rows;
        this.style = style;
    }
}
exports.Column = Column;
// Define una clase para las filas
class Row {
    constructor(columns, style) {
        this.columns = columns;
        this.style = style;
    }
}
exports.Row = Row;
;
// Nuevas funciones para renderizar el grid en el PDF
/**
 * Calcula el ancho de una columna basado en su tamaño y el ancho total disponible
 */
function calculateColumnWidth(columnSize, availableWidth, totalColumns = exports.pdfConfig.grid.columns) {
    return (columnSize / totalColumns) * availableWidth;
}
/**
 * Renderiza una fila con sus columnas en el PDF
 */
function renderRow(doc, row, x, y, availableWidth) {
    const rowStyle = row.style || {};
    let maxHeight = rowStyle.height || 0;
    let currentX = x;
    // Calcular la altura máxima de la fila basada en el contenido
    if (!rowStyle.height) {
        row.columns.forEach(column => {
            if (column.content) {
                const textDimensions = splitTextAndGetHeight(column.content, calculateColumnWidth(column.size, availableWidth) - (exports.pdfConfig.grid.defaultPadding * 2), doc);
                maxHeight = Math.max(maxHeight, textDimensions.height + (exports.pdfConfig.grid.defaultPadding * 2));
            }
            // Si la columna tiene filas anidadas, calcular su altura también
            if (column.rows && column.rows.length > 0) {
                let nestedHeight = 0;
                column.rows.forEach(nestedRow => {
                    // Simulación para calcular altura
                    nestedHeight += renderRow(doc, nestedRow, 0, 0, calculateColumnWidth(column.size, availableWidth));
                });
                maxHeight = Math.max(maxHeight, nestedHeight);
            }
        });
    }
    // Dibujar fondo de fila si está especificado
    if (rowStyle.backgroundColor) {
        doc.setFillColor(rowStyle.backgroundColor);
        doc.rect(x, y, availableWidth, maxHeight, 'F');
    }
    // Renderizar cada columna
    row.columns.forEach(column => {
        const columnWidth = calculateColumnWidth(column.size, availableWidth);
        const columnStyle = column.style || {};
        // Dibujar fondo de columna si está especificado
        if (columnStyle.backgroundColor) {
            doc.setFillColor(columnStyle.backgroundColor);
            doc.rect(currentX, y, columnWidth, maxHeight, 'F');
        }
        // Dibujar bordes si están especificados
        if (columnStyle.border) {
            doc.setDrawColor(0);
            doc.setLineWidth(0.1);
            if (typeof columnStyle.border === 'boolean' && columnStyle.border) {
                doc.rect(currentX, y, columnWidth, maxHeight);
            }
            else if (typeof columnStyle.border === 'object') {
                if (columnStyle.border.top) {
                    doc.line(currentX, y, currentX + columnWidth, y);
                }
                if (columnStyle.border.right) {
                    doc.line(currentX + columnWidth, y, currentX + columnWidth, y + maxHeight);
                }
                if (columnStyle.border.bottom) {
                    doc.line(currentX, y + maxHeight, currentX + columnWidth, y + maxHeight);
                }
                if (columnStyle.border.left) {
                    doc.line(currentX, y, currentX, y + maxHeight);
                }
            }
        }
        // Renderizar contenido de texto
        if (column.content) {
            const padding = typeof columnStyle.padding === 'number'
                ? columnStyle.padding
                : exports.pdfConfig.grid.defaultPadding;
            // Configurar estilo de texto
            if (columnStyle.textColor)
                doc.setTextColor(columnStyle.textColor);
            if (columnStyle.fontSize)
                doc.setFontSize(columnStyle.fontSize);
            if (columnStyle.fontStyle)
                doc.setFont(doc.getFont().fontName, columnStyle.fontStyle);
            const textX = currentX + padding;
            const textY = y + padding + doc.getLineHeight() / 2;
            const textDimensions = splitTextAndGetHeight(column.content, columnWidth - (padding * 2), doc);
            // Alinear texto horizontalmente
            let alignedX = textX;
            if (columnStyle.align === 'center') {
                alignedX = currentX + (columnWidth / 2);
                doc.text(textDimensions.text, alignedX, textY, { align: 'center' });
            }
            else if (columnStyle.align === 'right') {
                alignedX = currentX + columnWidth - padding;
                doc.text(textDimensions.text, alignedX, textY, { align: 'right' });
            }
            else {
                doc.text(textDimensions.text, alignedX, textY);
            }
            // Restaurar estilos por defecto
            doc.setTextColor(0);
            doc.setFontSize(exports.pdfConfig.fieldTextSize);
            doc.setFont(doc.getFont().fontName, 'normal');
        }
        // Renderizar filas anidadas si existen
        if (column.rows && column.rows.length > 0) {
            let nestedY = y + (typeof columnStyle.padding === 'number' ? columnStyle.padding : exports.pdfConfig.grid.defaultPadding);
            column.rows.forEach(nestedRow => {
                const rowHeight = renderRow(doc, nestedRow, currentX + (typeof columnStyle.padding === 'number' ? columnStyle.padding : exports.pdfConfig.grid.defaultPadding), nestedY, columnWidth - (2 * (typeof columnStyle.padding === 'number' ? columnStyle.padding : exports.pdfConfig.grid.defaultPadding)));
                nestedY += rowHeight;
            });
        }
        currentX += columnWidth;
    });
    return maxHeight + (rowStyle.marginBottom || 0);
}
/**
 * Renderiza un conjunto de filas en el PDF
 */
function renderGrid(doc, rows, x, y, width) {
    let currentY = y;
    rows.forEach(row => {
        const rowHeight = renderRow(doc, row, x, currentY, width);
        currentY += rowHeight;
    });
    return currentY - y; // Retorna la altura total del grid
}
