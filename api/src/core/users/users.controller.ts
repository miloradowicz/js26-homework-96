import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../user/user.schema';
import { Auth } from '../common/auth/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { useStorage } from '../common/storage/storage';
import { join } from 'path';
import config from 'src/config';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: useStorage(
        join(config.rootPath, config.publicPath, 'uploads/avatars'),
      ),
    }),
  )
  async register(
    @Body() userDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = new this.userModel({
      ...userDto,
      ...(file
        ? {
            avatarUrl: join(
              '/',
              config.publicPath,
              'uploads/avatars',
              file.filename,
            ),
          }
        : {}),
    });
    user.generateToken();
    await user.save();

    return user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  login(@Req() req: Request & { user: User }) {
    return req.user;
  }

  @Auth('user', 'admin')
  @Delete('sessions')
  async logout(@Req() req: Request & { user: User }) {
    const user = await this.userModel.findById(req.user._id);

    if (user) {
      user.clearToken();
      await user.save();
    }

    return { user: null };
  }
}
