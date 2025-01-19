import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function logoValidator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'logo-validator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value === 'string') return true;

          if (
            value !== null &&
            typeof value === 'object' &&
            typeof value.url === 'string'
          )
            return true;

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a string or an object with a string property 'url'`;
        },
      },
    });
  };
}
