import prisma from "../lib/prisma";

export interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
}

export const CategoryModel = {
  // Create a new category
  async create(data: CreateCategoryData) {
    return prisma.category.create({
      data,
    });
  },

  // Get all categories
  async getAll() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },

  // Get category by ID
  async getById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  // Create multiple categories
  async createMany(categories: CreateCategoryData[]) {
    return prisma.category.createMany({
      data: categories,
      skipDuplicates: true, // Skip if category with same name exists
    });
  },

  // Check if categories exist
  async checkIfCategoriesExist() {
    const count = await prisma.category.count();
    return count > 0;
  },

  // Get all categories with video count
  async getAllWithVideoCount() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { videos: true },
        },
      },
      orderBy: { name: "asc" },
    });
  },
};
