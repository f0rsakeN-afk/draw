import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { CategoryService } from '../services/categoryService';

// Get all categories
export const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategories();
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
});

// Get category by ID
export const getCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const category = await CategoryService.getCategoryById(id);
  
  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
});

// Create a new category (admin only)
export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.createCategory(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      category,
    },
  });
});

// Seed default categories (admin only)
export const seedDefaultCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.seedDefaultCategories();
  
  res.status(200).json({
    status: 'success',
    message: result.message,
  });
});

// Get all categories with video count
export const getCategoriesWithVideoCount = catchAsync(async (req: Request, res: Response) => {
  const categories = await CategoryService.getAllCategoriesWithVideoCount();
  
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
});
