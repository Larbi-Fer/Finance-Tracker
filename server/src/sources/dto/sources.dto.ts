import { IsNotEmpty, IsString } from "class-validator";

export class SourceDto {
  @IsNotEmpty({message: 'Title is required'})
  @IsString({message: 'Invalid title'})
  title: string;
}

export class UpdateSourceDto {
  title?: string;
}