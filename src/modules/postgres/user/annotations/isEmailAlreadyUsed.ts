import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { PostgresService } from '@/services/postgres-service';
import { User } from '@/entities/postgres/User';

@Service()
@ValidatorConstraint({ async: true })
export class IsEmailAlreadyUsedConstraint
    implements ValidatorConstraintInterface {
    private repository: Repository<User>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(User);
    }
    validate(email: string) {
        return this.repository.findOne({ where: { email } }).then((user) => {
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
