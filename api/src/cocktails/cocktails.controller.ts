import { Controller, Get } from '@nestjs/common';

@Controller('cocktails')
export class CocktailsController {
  constructor() {}

  @Get()
  getAll() {}
}
