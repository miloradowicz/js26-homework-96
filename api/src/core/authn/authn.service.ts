import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/user/user.schema';

@Injectable()
export class AuthnService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async getPrincipalForToken(token: string) {
    const user = await this.userModel.findOne({ token });

    return user ? user : null;
  }
}
