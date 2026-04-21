import { Router } from 'express';
import * as cartController from '../controllers/cartController';

const router = Router();

router.post('/', cartController.createCart);
router.get('/:cartId', cartController.getCart);
router.post('/:cartId/items', cartController.addItem);
router.patch('/:cartId/items/:productId', cartController.updateItem);
router.delete('/:cartId/items/:productId', cartController.removeItem);
router.delete('/:cartId', cartController.deleteCart);

export default router;
