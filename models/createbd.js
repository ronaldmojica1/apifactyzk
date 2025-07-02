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
const fs_1 = require("fs");
const database_1 = __importDefault(require("../config/database"));
const path_1 = __importDefault(require("path"));
const PATH_ROUTER = `${__dirname}`;
const cleanFileName = (fileName) => {
    const file = fileName.split(".").shift();
    return file;
};
// Two-phase model loading approach
const importModels = () => __awaiter(void 0, void 0, void 0, function* () {
    // Phase 1: Import all model definitions first without initializing associations
    console.log("Phase 1: Importing model definitions...");
    // Get all model folders
    const folders = (0, fs_1.readdirSync)(PATH_ROUTER).filter(folderName => {
        const cleanFolder = cleanFileName(folderName);
        return cleanFolder !== "migrate" && cleanFolder !== "createbd";
    });
    // First import all model definitions
    for (const folderName of folders) {
        const folderPath = path_1.default.join(PATH_ROUTER, folderName);
        try {
            const files = (0, fs_1.readdirSync)(folderPath).filter(fileName => (fileName.endsWith('.ts') || fileName.endsWith('.js')) &&
                !fileName.includes('.test.') &&
                !fileName.includes('.spec.'));
            for (const fileName of files) {
                const cleanName = cleanFileName(fileName);
                // Skip association files in first pass
                if (cleanName === null || cleanName === void 0 ? void 0 : cleanName.toLowerCase().includes('association')) {
                    continue;
                }
                try {
                    console.log(`Importing model: ${folderName}/${cleanName}`);
                    yield Promise.resolve(`${`./${folderName}/${cleanName}`}`).then(s => __importStar(require(s)));
                }
                catch (error) {
                    console.error(`Error importing model ${folderName}/${cleanName}:`, error);
                }
            }
        }
        catch (error) {
            console.error(`Error reading directory ${folderPath}:`, error);
        }
    }
    console.log("Phase 1 complete: All model definitions imported");
    // Phase 2: Now import association files if they exist
    console.log("Phase 2: Setting up associations...");
    for (const folderName of folders) {
        const folderPath = path_1.default.join(PATH_ROUTER, folderName);
        try {
            const files = (0, fs_1.readdirSync)(folderPath).filter(fileName => (fileName.endsWith('.ts') || fileName.endsWith('.js')) &&
                fileName.toLowerCase().includes('association'));
            for (const fileName of files) {
                const cleanName = cleanFileName(fileName);
                try {
                    console.log(`Importing associations: ${folderName}/${cleanName}`);
                    yield Promise.resolve(`${`./${folderName}/${cleanName}`}`).then(s => __importStar(require(s)));
                }
                catch (error) {
                    console.error(`Error importing associations ${folderName}/${cleanName}:`, error);
                }
            }
        }
        catch (error) {
            console.error(`Error reading directory ${folderPath}:`, error);
        }
    }
    console.log("Phase 2 complete: All associations set up");
});
// Main function to run the database sync
const syncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Import all models in two phases
        yield importModels();
        // Then sync the database
        console.log("Syncing database...");
        yield database_1.default.sync({ force: true });
        console.log("Database synced successfully");
    }
    catch (error) {
        console.error("Error syncing database:", error);
        process.exit(1);
    }
});
// Run the sync process
syncDatabase();
