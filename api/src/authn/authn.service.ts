import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthnService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async getPrincipalForToken(token: string) {
    await this.userModel.findById('2');
    await this.userModel.create({});
    const user = await this.userModel.findOne({ token });

    return user ? String(user._id) : null;
  }
}
