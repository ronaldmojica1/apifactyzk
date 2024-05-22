"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const usejwt_1 = require("../utils/usejwt");
const apiresponse_1 = require("../config/apiresponse");
const checkJwt = (req, res, next) => {
    try {
        const jwtByUser = req.headers.authorization || "";
        const jwt = jwtByUser.split(" ").pop(); // 11111
        const isUser = (0, usejwt_1.verifyToken)(`${jwt}`);
        if (!isUser) {
            res.status(401);
            res.send((0, apiresponse_1.errorResponse)("NO_TIENES_UN_JWT_VALIDO"));
        }
        else {
            req.user = isUser;
            next();
        }
    }
    catch (e) {
        console.log({ e });
        res.status(401);
        res.send((0, apiresponse_1.errorResponse)("SESSION_NO_VALIDAD"));
    }
};
exports.checkJwt = checkJwt;
