import { Allow, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CategoryDto {
  @IsNotEmpty({message: 'Title is required'})
  @IsString({message: 'Invalid title'})
  title: string;
  
  @Allow()
  icon?: string

  @Allow()
  budget: {
    currencyId: string;
    amount: number
  }[]
}

export class UpdateCategoryDto {
  title?: string;
  amount?: number;
}