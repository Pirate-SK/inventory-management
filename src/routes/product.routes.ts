import { Router } from 'express';
import ProductController from '../controllers/product.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // Protect all product routes

router.post('/create', ProductController.create);
router.get('/getProducts', ProductController.getProducts);
router.post('/update', ProductController.update);
router.post('/delete', ProductController.delete);

export default router; 