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
const PATH_ROUTER = `${__dirname}`;
/**
 * Clean filename by removing extension
 */
const cleanFileName = (fileName) => {
    const file = fileName.split(".").shift();
    return file;
};
/**
 * Import all models for synchronization
 */
const importModels = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🔄 Importing models...');
    const folders = (0, fs_1.readdirSync)(PATH_ROUTER).filter((folderName) => {
        const cleanFolder = cleanFileName(folderName);
        return cleanFolder !== "migrate" && cleanFolder !== "createbd" && cleanFolder !== "sync";
    });
    for (const folderName of folders) {
        const cleanFolder = cleanFileName(folderName);
        const files = (0, fs_1.readdirSync)(PATH_ROUTER + '/' + cleanFolder);
        for (const fileName of files) {
            const cleanName = cleanFileName(fileName);
            if (cleanName) {
                try {
                    yield Promise.resolve(`${`./${cleanFolder}/${cleanName}`}`).then(s => __importStar(require(s)));
                    console.log(`✓ Imported model: ${cleanFolder}/${cleanName}`);
                }
                catch (error) {
                    console.error(`✗ Failed to import ${cleanFolder}/${cleanName}:`, error);
                }
            }
        }
    }
});
/**
 * Synchronize all models with alter: true
 */
const syncModels = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('🔄 Starting model synchronization with alter: true...');
        // Import all models first
        yield importModels();
        // Test database connection
        yield database_1.default.authenticate();
        console.log('✓ Database connection established successfully');
        // Sync all models with alter: true
        yield database_1.default.sync({ alter: true });
        console.log('✅ All models synchronized successfully with alter: true');
        console.log('📊 Synchronization summary:');
        const modelNames = Object.keys(database_1.default.models);
        modelNames.forEach(modelName => {
            console.log(`  - ${modelName}`);
        });
        console.log(`\n🎉 Synchronized ${modelNames.length} models total`);
    }
    catch (error) {
        console.error('❌ Error during model synchronization:', error);
        throw error;
    }
    finally {
        yield database_1.default.close();
        console.log('🔌 Database connection closed');
    }
});
// Run synchronization if this file is executed directly
if (require.main === module) {
    syncModels()
        .then(() => {
        console.log('✅ Sync process completed successfully');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Sync process failed:', error);
        process.exit(1);
    });
}
exports.default = syncModels;
