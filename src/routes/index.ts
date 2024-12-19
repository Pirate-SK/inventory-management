
import bodyParser from 'body-parser';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import { Router } from 'express';

const jsonParser = bodyParser.json({ limit: "50mb" })
const router = Router();


router.get('/', (req: any, res: any) => {
    res.status(200).send({
        message: 'Welcome to the API!',
    })
    return;
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);

export default router;