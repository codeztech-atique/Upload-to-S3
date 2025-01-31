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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_s3_1 = require("@aws-sdk/client-s3");
var lib_storage_1 = require("@aws-sdk/lib-storage");
var fs = require("fs");
var path = require("path");
var dotenv = require("dotenv");
// Load environment variables
dotenv.config();
// Initialize S3 Client
var s3 = new client_s3_1.S3Client({
    region: "us-east-1",
});
// Function to Upload File to S3
function uploadFileToS3(filePath, bucketName, s3Key) {
    return __awaiter(this, void 0, void 0, function () {
        var resolvedFilePath, fileStream, uploadParams, upload, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🚀 Upload started...");
                    resolvedFilePath = path.join(__dirname, filePath);
                    // Check if file exists
                    if (!fs.existsSync(resolvedFilePath)) {
                        console.error("\u274C Error: File not found at ".concat(resolvedFilePath));
                        return [2 /*return*/];
                    }
                    fileStream = fs.createReadStream(resolvedFilePath);
                    uploadParams = {
                        Bucket: bucketName,
                        Key: s3Key,
                        Body: fileStream,
                    };
                    upload = new lib_storage_1.Upload({
                        client: s3,
                        params: uploadParams,
                        partSize: 10 * 1024 * 1024, // 10MB chunks
                        leavePartsOnError: true,
                    });
                    upload.on("httpUploadProgress", function (progress) {
                        var _a, _b;
                        var loaded = (_a = progress.loaded) !== null && _a !== void 0 ? _a : 0;
                        var total = (_b = progress.total) !== null && _b !== void 0 ? _b : 1;
                        var percentage = ((loaded / total) * 100).toFixed(2);
                        console.log("\uD83D\uDCE4 Upload progress: ".concat(percentage, "%"));
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, upload.done()];
                case 2:
                    _a.sent();
                    console.log("✅ Upload completed successfully!");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("❌ Upload failed:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Call the function to upload
var filePath = "./data/27_january_part_1.mp4"; // Change to actual file path
var bucketName = "training.clothovia.com";
var s3Key = "facebook-ads/day1/".concat(path.basename(filePath));
uploadFileToS3(filePath, bucketName, s3Key);
