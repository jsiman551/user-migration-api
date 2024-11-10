import express from 'express';
import { uploadCsv, retryCsvUpload } from '../controllers/uploadController';
import authMiddleware from '../middlewares/requireAuth';
import upload from '../middlewares/multerMiddleware';

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('file'), uploadCsv);
router.post('/upload/retry', retryCsvUpload);

export default router;
