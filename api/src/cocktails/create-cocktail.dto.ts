import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateCocktailDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  image: File;

  @IsNotEmpty()
  @IsString()
  recipe: string;

  @IsNotEmpty()
  // @IsArray()
  ingredients: { name: string; qty: string | null }[];
}
