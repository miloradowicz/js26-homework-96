import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Principal } from 'src/core/common/principal/principal.param-decorator';
import { User } from 'src/core/user/user.schema';
import { Cocktail } from 'src/cocktail/cocktail.schema';
import { Auth } from 'src/core/common/auth/auth.decorator';
import { CreateCocktailDto } from './create-cocktail.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { useStorage } from 'src/core/common/storage/storage';
import config from 'src/config';
import { RateCocktailDto } from './rate-cocktail.dto';

@Controller('cocktails')
export class CocktailsController {
  constructor(
    @InjectModel(Cocktail.name) private readonly cocktailModel: Model<Cocktail>,
  ) {}

  @Auth('user', 'admin')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: useStorage(
        join(config.rootPath, config.publicPath, 'uploads/cocktails'),
      ),
    }),
  )
  async create(
    @Body() cocktailDto: CreateCocktailDto,
    @UploadedFile() file: Express.Multer.File,
    @Principal() principal: User,
  ) {
    const cocktail = await this.cocktailModel.create({
      ...cocktailDto,
      user: principal,
      ...(file
        ? {
            imageUrl: join(
              '/',
              config.publicPath,
              'uploads/cocktails',
              file.filename,
            ),
          }
        : {}),
    });

    return cocktail.depopulate();
  }

  @Auth()
  @Get()
  async getAll(@Principal() principal?: User) {
    let filters = [{}];

    if (!principal) {
      filters = [{ isPublished: true }];
    } else if (principal.role !== 'admin') {
      filters = [{ isPublished: true }, { user: principal._id }];
    }

    const result = await this.cocktailModel.aggregate<
      Omit<Cocktail, 'user' | 'recipe' | 'ingredients'>
    >([
      {
        $match: { $or: filters },
      },
      {
        $project: {
          user: 0,
          recipe: 0,
          ingredients: 0,
        },
      },
      {
        $replaceWith: {
          $setField: {
            field: 'fields',
            input: '$$ROOT',
            value: { $unsetField: { field: 'ratings', input: '$$ROOT' } },
          },
        },
      },
      {
        $unwind: { path: '$ratings', preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: '$fields',
          rating: { $avg: '$ratings.rating' },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $mergeObjects: ['$$ROOT', '$_id'] },
        },
      },
      {
        $sort: { name: 1 },
      },
    ]);

    return result;
  }

  @Auth()
  @Get(':id')
  async get(@Param('id') id: string, @Principal() principal?: User) {
    const result = await this.cocktailModel.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    if (
      !result.isPublished &&
      !principal?._id.equals(result.user._id) &&
      principal?.role !== 'admin'
    ) {
      throw new ForbiddenException();
    }

    return result;
  }

  @Auth('admin')
  @Patch(':id')
  async togglePublish(@Param('id') id: string) {
    const result = await this.cocktailModel.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    result.isPublished = !result.isPublished;
    await result.save();

    return result;
  }

  @Auth('user', 'admin')
  @Patch('rate/:id')
  async rate(
    @Param('id') id: string,
    @Body() cocktailDto: RateCocktailDto,
    @Principal() principal: User,
  ) {
    const result = await this.cocktailModel.findById(id);

    if (!result) {
      throw new NotFoundException();
    }

    const i = result.ratings.findIndex((x) => principal._id.equals(x.user));

    if (i < 0) {
      result.ratings.push({
        user: principal._id,
        rating: cocktailDto.rating,
      });
    } else {
      result.ratings[i].rating = cocktailDto.rating;
    }
    result.depopulate();
    await result.save();

    return result.depopulate();
  }
}
