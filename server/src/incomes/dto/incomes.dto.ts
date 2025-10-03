import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class IncomeDto {
  title?: string;
  @IsNotEmpty({message: 'Amount is required'})
  @IsNumber({}, {message: 'Invalid amount'})
  amount: number;
  @IsNotEmpty({message: 'Date is required'})
  date: Date;
  @IsNotEmpty({message: 'Source is required'})
  sourceId: string;
  @IsNotEmpty({message: 'Wallet is required'})
  walletId: string;

  icon?: string;
}

export class UpdateIncomeDto {
  title?: string;
  amount?: number;
  date?: Date;
  sourceId?: string;
  walletId?: string;
}