import {
  Body,
  Controller,
  Delete,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.schema';
import { Auth } from '../common/auth/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { useStorage } from '../common/storage/storage';
import { join } from 'path';
import config from 'src/config';
import { Principal } from '../common/principal/principal.param-decorator';
import { GoogleService } from './google.service';
import { GoogleLoginDto } from './google-login.dto';

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly googleService: GoogleService,
  ) {}

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
  login(@Principal() principal: User) {
    return { user: principal };
  }

  @Auth('user', 'admin')
  @Delete('sessions')
  async logout(@Principal() principal: User) {
    const user = await this.userModel.findById(principal._id);

    if (user) {
      user.clearToken();
      await user.save();
    }

    return { user: null };
  }

  @Post('google')
  async googleLogin(@Body() googleLogin: GoogleLoginDto) {
    const ticket = await this.googleService.verifyIdToken({
      idToken: googleLogin.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException();
    }

    const email = payload.email;
    const id = payload.sub;
    const displayName = payload.name;
    const avatarUrl = payload.picture;

    if (!email) {
      throw new UnauthorizedException();
    }

    let user = await this.userModel.findOne({ googleId: id });

    if (!user) {
      user = new this.userModel({
        email: email,
        password: crypto.randomUUID(),
        googleId: id,
        displayName,
        avatarUrl,
      });
    }

    user.generateToken();
    await user.save();

    return { user };
  }
}
