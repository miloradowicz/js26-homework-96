import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { IsMongoDocument } from '../common/class-validators/is-mongo-document';
import { User } from '../user/user.schema';
import { emailRegex } from '../constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Matches(emailRegex)
  @IsMongoDocument(User, 'email', true)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(5)
  password: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  avatar: File;
}
