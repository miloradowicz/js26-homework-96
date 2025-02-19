import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/core/user/user.schema';
import { Cocktail } from 'src/schemas/cocktail.schema';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Cocktail.name) private readonly cocktailModel: Model<Cocktail>,
  ) {}

  async seed() {
    console.log('Seeding commenced');

    console.log('Deleting existing documents...');
    console.log('Deleting users...');
    await this.userModel.deleteMany().catch(() => console.log('skipped'));
    console.log('Deleting cocktails...');
    await this.cocktailModel.deleteMany().catch(() => console.log('skipped'));

    console.log('Creating sample documents...');
    console.log('Creating users...');
    await this.userModel.create(
      {
        email: 'admin@drinkalot.com',
        password: '1111',
        displayName: 'John Doe',
        role: 'admin',
      },
      {
        email: 'fantastic_user@gmail.com',
        password: '2222',
        displayName: 'Jane Doe',
      },
      {
        email: 'doting_user@outlook.com',
        password: '3333',
        displayName: 'Taylor Hebert',
      },
      {
        email: 'amused_user@rambler.com',
        password: '4444',
        displayName: 'Dorian Gray',
      },
    );
  }
}
