import { Router } from 'express';
import { createDocument, getDocuments, updateDocument, deleteDocument } from '../controllers/document.controller';

const router = Router();

router.post('/', createDocument);
router.get('/', getDocuments);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;