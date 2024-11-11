"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadController_1 = require("../controllers/uploadController");
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const multerMiddleware_1 = __importDefault(require("../middlewares/multerMiddleware"));
const router = express_1.default.Router();
router.post('/upload', requireAuth_1.default, multerMiddleware_1.default.single('file'), uploadController_1.uploadCsv);
router.post('/upload/retry', uploadController_1.retryCsvUpload);
exports.default = router;
