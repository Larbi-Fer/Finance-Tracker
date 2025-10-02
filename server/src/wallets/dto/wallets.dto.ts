import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class WalletDto {
  @IsNotEmpty({message: 'Name is required'})
  @IsString({message: 'Invalid name'})
  name: string;

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