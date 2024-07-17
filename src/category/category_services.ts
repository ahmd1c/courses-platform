import { CategoryRepository, CategoryeModel } from "./Category_Repo";
import { TCategory } from "../types";
import { AppError } from "../errorHandler/App-error-class";

class CategoryService {
  constructor(private readonly CategoryModel: CategoryRepository) {
    this.CategoryModel = CategoryModel;
  }
  async GetAllCategories() {
    const categories = await this.CategoryModel.findMany();
    if (!categories.length) throw new AppError("categories not found", 404);
    return categories;
  }

  async CreateCategory(category: TCategory) {
    const [isExists] = (await this.CategoryModel.findOne({
      name: category.name,
    })) as TCategory[];
    if (isExists) throw new AppError("category is already present", 409);

    const [newCategory] = await this.CategoryModel.insert(category);
    return newCategory;
  }

  async GetCategoryById(id: number) {
    const [category] = (await this.CategoryModel.findOne({
      id,
    })) as TCategory[];
    if (!category) throw new AppError("category not found", 404);
    return category;
  }

  async GetCategoryByName(name: string) {
    const [category] = (await this.CategoryModel.findOne({ name })) as TCategory[];
    if (!category) throw new AppError("category not found", 404);
    return category;
  }

  async updateCategory(id: number, name: string) {
    const [updatedCategory] = await this.CategoryModel.update(
      {
        id,
      },
      {
        name,
      }
    );
    if (!updatedCategory) throw new AppError("category not found", 404);

    return updatedCategory;
  }

  async deleteCategory(id: number) {
    const [deletedCategory] = await this.CategoryModel.delete({
      id,
    });
    if (!deletedCategory) throw new AppError("Category not found", 404);
    return deletedCategory;
  }
}

export const CategoryServiceInstance = new CategoryService(CategoryeModel);
