import { IsNotEmpty, IsNumber, IsSemVer, IsString } from "class-validator";

export class ExpenseDto {
  @IsNotEmpty({message: 'Title is required'})
  @IsString({message: 'Invalid title'})
  title: string;
  @IsNotEmpty({message: 'Amount is required'})
  @IsNumber({}, {message: 'Invalid amount'})
  amount: number;
  @IsNotEmpty({message: 'Date is required'})
  date: Date;
  categoryId?: string;
  walletId?: string;
  icon?: string
}

export class UpdateExpenseDto {
  title?: string;
  amount?: number;
  icon?: string;
  date?: Date;
  categoryId?: string;
  walletId?: string;
}