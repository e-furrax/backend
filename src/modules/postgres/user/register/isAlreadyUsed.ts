import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { User } from '../../../../entities/postgres/User';

@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyUsedConstraint
    implements ValidatorConstraintInterface {
    validate(username: string) {
        return User.findOne({ where: { username } }).then((user) => {
            if (user) return false;
            return true;
        });
    }
}

export function IsUsernameAlreadyUsed(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUsernameAlreadyUsedConstraint,
        });
    };
}

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyUsedConstraint
    implements ValidatorConstraintInterface {
    validate(email: string) {
        return User.findOne({ where: { email } }).then((user) => {
            if (user) return false;
            return true;
        });
    }
}

export function IsEmailAlreadyUsed(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyUsedConstraint,
        });
    };
}
