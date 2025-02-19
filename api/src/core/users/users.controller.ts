import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User, UserDocument } from '../user/user.schema';
import { Auth } from '../common/auth/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Post()
  async register(@Body() userDto: CreateUserDto) {
    try {
      const user = new this.userModel({ ...userDto });
      user.generateToken();
      await user.save();

      return user;
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        throw new BadRequestException(e);
      }

      throw e;
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  login(@Req() req: Request & { user: UserDocument }) {
    return req.user;
  }

  @Auth('user', 'admin')
  @Delete('sessions')
  async logout(@Req() req: Request & { user: UserDocument }) {
    const user = await this.userModel.findById(req.user._id);

    if (user) {
      user.clearToken();
      await user.save();
    }

    return { user: null };
  }
}
