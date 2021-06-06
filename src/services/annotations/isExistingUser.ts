import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Service, Container } from 'typedi';
import { Connection } from 'typeorm';
import { User } from '@/entities/postgres/User';

@Service()
@ValidatorConstraint({ async: true })
class isExistingUserConstraint implements ValidatorConstraintInterface {
    validate(id: number) {
        const postgres = Container.get('POSTGRES_MANAGER') as Connection;
        return postgres
            .getRepository(User)
            .findOne({ where: { id } })
            .then((user) => !!user);
    }
}

export function isExistingUser(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: isExistingUserConstraint,
        });
    };
}
