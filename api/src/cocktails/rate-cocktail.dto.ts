import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class RateCocktailDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  rating: number;
}
