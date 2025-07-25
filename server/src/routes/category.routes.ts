import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/with-video-count', categoryController.getCategoriesWithVideoCount);
router.get('/:id', categoryController.getCategory);

// Protected routes
router.use(protect);

// Admin routes
router.use(restrictTo('admin'));
router.post('/', categoryController.createCategory);
router.post('/seed-defaults', categoryController.seedDefaultCategories);

export default router;
