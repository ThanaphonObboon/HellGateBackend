import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    console.log('ValidationPipe');
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const constraints = errors.map((m) => m.constraints);
      if (constraints.length > 0) {
        const constraint = constraints[0];
        const message = Object.keys(constraint).map((m) => constraint[m]);
        throw new BadRequestException(message.pop());
      }
      throw new BadRequestException('Validation faild');
    }
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

export class CustomValidationRpcPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    console.log('ValidationPipe');
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const constraints = errors.map((m) => m.constraints);
      if (constraints.length > 0) {
        const constraint = constraints[0];
        const message = Object.keys(constraint).map((m) => constraint[m]);
        throw new RpcException(message.pop());
      }
      throw new RpcException('Validation faild');
    }
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

export function IsComparePassword(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    if (!validationOptions) {
      validationOptions = {};
      validationOptions.message = propertyName + ' not match ' + property;
    }
    registerDecorator({
      name: 'IsComparePassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return args.object[property] === value; // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
