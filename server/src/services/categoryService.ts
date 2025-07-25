import { CategoryModel, CreateCategoryData } from "../models/category.model";
import { AppError } from "../utils/AppError";

const defaultCategories: CreateCategoryData[] = [
  { name: 'Gaming', description: 'Gameplay, walkthroughs, and esports', icon: '🎮' },
  { name: 'Music', description: 'Songs, covers, and music videos', icon: '🎵' },
  { name: 'Education', description: 'Learning and educational content', icon: '📚' },
  { name: 'Entertainment', description: 'Fun and entertaining videos', icon: '🎭' },
  { name: 'News', description: 'Latest news and updates', icon: '📰' },
  { name: 'Cooking', description: 'Recipes and cooking tutorials', icon: '🍳' },
  { name: 'Fitness', description: 'Workout and health tips', icon: '💪' },
  { name: 'Travel', description: 'Travel vlogs and guides', icon: '✈️' },
  { name: 'Technology', description: 'Tech reviews and tutorials', icon: '💻' },
  { name: 'Sports', description: 'Sports highlights and analysis', icon: '⚽' },
];

export const CategoryService = {
  // Get all categories
  async getAllCategories() {
    return CategoryModel.getAll();
  },

  // Get category by ID
  async getCategoryById(id: string) {
    const category = await CategoryModel.getById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  },

  // Create a new category
  async createCategory(data: CreateCategoryData) {
    return CategoryModel.create(data);
  },

  // Seed default categories if none exist
  async seedDefaultCategories() {
    const hasCategories = await CategoryModel.checkIfCategoriesExist();
    
    if (!hasCategories) {
      await CategoryModel.createMany(defaultCategories);
      return { message: 'Default categories created successfully' };
    }
    
    return { message: 'Categories already exist' };
  },

  // Get all categories with video count
  async getAllCategoriesWithVideoCount() {
    return CategoryModel.getAllWithVideoCount();
  },
};
