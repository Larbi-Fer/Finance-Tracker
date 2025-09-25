import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CategoryDto {
  @IsNotEmpty({message: 'Title is required'})
  @IsString({message: 'Invalid title'})
  title: string;
  
  @IsNotEmpty({message: 'Amount is required'})
  @IsNumber({}, {message: 'Invalid amount'})
  amount: number;
}

export class UpdateCategoryDto {
  title?: string;
  amount?: number;
}