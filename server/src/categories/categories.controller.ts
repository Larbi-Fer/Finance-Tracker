import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto, UpdateCategoryDto } from './dto/categories.dto';

@Controller(':id/categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getCategories(@Param('id') userId: string) {
    return this.categoriesService.getCategories(userId);
  }

  @Get(':categoryId')
  getCategory(@Param('categoryId') categoryId: string, @Param('id') userId: string) {
    return this.categoriesService.getCategory(categoryId, userId);
  }

  @Post('')
  createCategory(@Param('id') userId: string, @Body() data: CategoryDto) {
    return this.categoriesService.createCategory(userId, data);
  }

  @Patch(':categoryId')
  updateCategory(
    @Param('categoryId') categoryId: string,
    @Param('id') userId: string,
    @Body() data: UpdateCategoryDto
  ) {
    return this.categoriesService.updateCategory(categoryId, userId, data);
  }

  @Delete(':categoryId')
  deleteCategory(@Param('categoryId') categoryId: string, @Param('id') userId: string) {
    return this.categoriesService.deleteCategory(categoryId, userId);
  }
}
