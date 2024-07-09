"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTemplate = void 0;
const RptPdfUtils_1 = require("../utils/RptPdfUtils");
const Head_1 = require("./Head");
const Invoice_1 = require("./Invoice");
function initTemplate(param) {
    let doc = (0, RptPdfUtils_1.initDocCreation)(param);
    const docWidth = (0, RptPdfUtils_1.getDocWidth)(doc);
    const docHeight = (0, RptPdfUtils_1.getDocHeight)(doc);
    let currentHeight = 15;
    //Set header
    let head = (0, Head_1.initHead)(doc, param.head, currentHeight);
    currentHeight = head.currentHeight;
    //Set invoice
    let invObj = (0, Invoice_1.initInvoice)(doc, param.invoice, currentHeight, param.orientationLandscape);
    //Set footer
    //Export
    let returnObj = {
        pagesNumber: doc.getNumberOfPages(),
    };
    if (param.returnJsPDFDocObject) {
        returnObj = Object.assign(Object.assign({}, returnObj), { jsPDFObject: doc });
    }
    if (param.outputType === 'save')
        doc.save(param.fileName);
    else if (param.outputType === "blob") {
        const blobOutput = doc.output("blob");
        returnObj = Object.assign(Object.assign({}, returnObj), { blob: blobOutput });
    }
    else if (param.outputType === "datauristring") {
        returnObj = Object.assign(Object.assign({}, returnObj), { dataUriString: doc.output("datauristring", {
                filename: param.fileName,
            }) });
    }
    else if (param.outputType === "arraybuffer") {
        returnObj = Object.assign(Object.assign({}, returnObj), { arrayBuffer: doc.output("arraybuffer") });
    }
    else
        doc.output(param.outputType, {
            filename: param.fileName,
        });
    return returnObj;
}
exports.initTemplate = initTemplate;
