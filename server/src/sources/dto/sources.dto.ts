import { IsNotEmpty, IsString } from "class-validator";

export class SourceDto {
  @IsNotEmpty({message: 'Title is required'})
  @IsString({message: 'Invalid title'})
  title: string;

  @IsNotEmpty({message: 'Currency id is required'})
  @IsString({message: 'Invalid currency id'})
  currencyId: string;
}

export class UpdateSourceDto {
  title?: string;
}