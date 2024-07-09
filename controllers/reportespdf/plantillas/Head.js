"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initHead = void 0;
const RptPdfUtils_1 = require("../utils/RptPdfUtils");
function initHead(doc, head, currentHeight) {
    const docWidth = (0, RptPdfUtils_1.getDocWidth)(doc);
    const useWidth = (docWidth - 20);
    const oneColWidth = (useWidth / 12); //12 columnas por fila
    const generateInvHead = (rows) => {
        doc.setTextColor(RptPdfUtils_1.colorBlack);
        doc.setFontSize(RptPdfUtils_1.pdfConfig.labelTextSize);
        const calculateColumnWidth = (size, totalWidth) => {
            const baseGridSize = 12; // Basado en un sistema de grilla de 12 columnas
            return (size / baseGridSize) * totalWidth;
        };
        const addContentToPDF = (doc, rows, startX = 10, startY = 10, totalWidth = useWidth) => {
            //const paddingY = pdfConfig.subLineHeight;
            let currentY = startY;
            rows.forEach((row, indR) => {
                console.log("fila " + indR);
                let maxHeight = 0;
                let acumHeight = 0;
                let currentX = startX;
                row.columns.forEach((column, indC) => {
                    console.log("columna " + indC);
                    const columnWidth = calculateColumnWidth(column.size, totalWidth);
                    const text = (0, RptPdfUtils_1.splitTextAndGetHeight)((column.content || ''), columnWidth, doc);
                    // Añadir el texto en la posición actual
                    doc.text(text.text, currentX, currentY);
                    // Calcular la altura utilizada por el texto (ejemplo simple, se puede mejorar)
                    const textHeight = text.height; // Ajustar según el contenido real              
                    // Ajustar la posición horizontal para la próxima columna
                    currentX += columnWidth;
                    // Determinar la altura máxima de la fila actual
                    if (textHeight > maxHeight) {
                        maxHeight = textHeight;
                    }
                    console.log("maxheight " + maxHeight);
                    // Añadir filas anidadas si existen
                    if (column.rows && column.rows.length > 0) {
                        console.log("entro en columna con filas");
                        const nestedY = currentY + maxHeight;
                        console.log("Nestedy:" + nestedY);
                        const nestedMaxHeight = addContentToPDF(doc, column.rows, currentX - columnWidth, nestedY, columnWidth);
                        console.log("nestedmaxheight " + nestedMaxHeight);
                        acumHeight = nestedMaxHeight;
                    }
                });
                // Ajustar la posición vertical para la próxima fila
                if (acumHeight > 0) {
                    currentY = acumHeight;
                }
                else {
                    currentY += maxHeight;
                }
                console.log("current y luego de finalizar la fila " + currentY);
            });
            return currentY;
        };
        currentHeight = addContentToPDF(doc, rows);
    };
    generateInvHead(head.rows);
    return {
        doc,
        currentHeight
    };
}
exports.initHead = initHead;
