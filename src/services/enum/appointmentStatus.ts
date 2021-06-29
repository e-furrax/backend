import { registerEnumType } from 'type-graphql';

export enum AppointmentStatus {
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING',
    DONE = 'DONE',
}

registerEnumType(AppointmentStatus, {
    name: 'AppointmentStatus',
    description: 'Basic appointment status',
});
