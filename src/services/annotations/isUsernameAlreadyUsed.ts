import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Container, Service } from 'typedi';
import { Connection } from 'typeorm';
import { User } from '@/entities/postgres/User';

@Service()
@ValidatorConstraint({ async: true })
class IsUsernameAlreadyUsedConstraint implements ValidatorConstraintInterface {
    validate(username: string) {
        const postgres = Container.get('POSTGRES_MANAGER') as Connection;
        return postgres
            .getRepository(User)
            .findOne({ where: { username } })
            .then((user) => {
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
