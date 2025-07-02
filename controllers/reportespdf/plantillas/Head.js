"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initHead = initHead;
const RptPdfUtils_1 = require("../utils/RptPdfUtils");
function initHead(doc, head, currentHeight) {
    const docWidth = (0, RptPdfUtils_1.getDocWidth)(doc);
    const useWidth = (docWidth - 20); // Leaving 10px margin on each side
    // Set default text properties
    doc.setTextColor(RptPdfUtils_1.colorBlack);
    doc.setFontSize(RptPdfUtils_1.pdfConfig.labelTextSize);
    // Use the new renderGrid function to render all rows
    const totalHeight = (0, RptPdfUtils_1.renderGrid)(doc, head.rows, 10, currentHeight, useWidth);
    // Update currentHeight with the total height of the rendered grid
    currentHeight += totalHeight;
    return {
        doc,
        currentHeight
    };
}
