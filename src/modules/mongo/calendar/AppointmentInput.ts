import { Field, InputType, ObjectType } from 'type-graphql';
import { Appointment, AppointmentModel } from '@/entities/mongo/Appointment';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
@ValidatorConstraint({ async: true })
class isTitleUniqueConstraint implements ValidatorConstraintInterface {
    validate(title: string) {
        return AppointmentModel.findOne({ title }).then(
            (appointment) => !appointment
        );
    }
}
function isTitleUnique(options?: ValidationOptions) {
    return (obj: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: obj.constructor,
            propertyName,
            options,
            constraints: [],
            validator: isTitleUniqueConstraint,
        });
    };
}
@ObjectType()
@InputType()
export class AppointmentInput implements Partial<Appointment> {
    @Field()
    @isTitleUnique({ message: 'title already taken' })
    public title: string;
}
