import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Connection, Error } from 'mongoose';

@ValidatorConstraint({ name: 'IsMongoDocument', async: true })
@Injectable()
export class IsMongoDocumentRule implements ValidatorConstraintInterface {
  private e: unknown;

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(value: string, args: ValidationArguments) {
    try {
      const model =
        this.connection.models[(args.constraints[0] as { name: string }).name];
      const fieldName = args.constraints[1] as string | undefined;
      const inverse = !!args.constraints[2];

      if (!fieldName) {
        return (await model.findById(value)) ? !inverse : inverse;
      } else {
        return (await model.findOne({ [fieldName]: value }))
          ? !inverse
          : inverse;
      }
    } catch (e) {
      this.e = e;
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    if (this.e instanceof Error.CastError) {
      return this.e.message;
    } else {
      return `${args.property} ${!args.constraints[2] ? 'does not exist' : 'already exists'}`;
    }
  }
}
