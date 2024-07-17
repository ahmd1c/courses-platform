import { CategoryServiceInstance } from "./category_services";
import asyncHandler from "../utils/asyncHandler";

export const createCategoryController = asyncHandler(async (req, res, next) => {
  const newCategory = await CategoryServiceInstance.CreateCategory(req.body);
  res
    .status(201)
    .json({ message: "Category Created Successfully", category: newCategory });
});

export const getAllCategoriesController = asyncHandler(async (req, res, next) => {
  const categories = await CategoryServiceInstance.GetAllCategories();
  res.status(200).json({ categories });
});

export const updateCategoryController = asyncHandler(async (req, res, next) => {
  const updatedCategory = await CategoryServiceInstance.updateCategory(
    parseInt(req.params.categoryId),
    req.body.name
  );

  res.status(201).json({
    success: true,
    updatedCategory,
  });
});

export const deleteCategoryController = asyncHandler(async (req, res, next) => {
  const deletedCategory = await CategoryServiceInstance.deleteCategory(
    parseInt(req.params.categoryId)
  );

  res.status(201).json({
    success: true,
    deletedCategory,
  });
});
