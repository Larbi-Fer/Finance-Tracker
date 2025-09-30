import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class WalletDto {
  @IsNotEmpty({message: 'Name is required'})
  @IsString({message: 'Invalid name'})
  name: string;
  
  @IsNumber({}, {message: 'Invalid income balance'})
  incomeBalance?: number = 0;

  @IsNumber({}, {message: 'Invalid expenses balance'})
  expensesBalance?: number = 0;

  @IsNotEmpty({message: 'Currency is required'})
  @IsString({message: 'Invalid currency'})
  currencyId: string;
}

export class UpdateWalletDto {
  name?: string;
  incomeBalance?: number;
  expensesBalance?: number;
  currencyId?: string;
}