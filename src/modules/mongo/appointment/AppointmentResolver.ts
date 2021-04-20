import {
    Resolver,
    Query,
    Mutation,
    Arg,
    Ctx,
    UseMiddleware,
} from 'type-graphql';
import { DeleteWriteOpResultObject, MongoRepository } from 'typeorm';

import { MyContext } from '@/types/MyContext';
import { isAuth } from '@/middlewares/isAuth';
import { MongoService } from '@/services/mongo-manager';

import { Appointment } from '@/entities/mongo/Appointment';
import { Transaction } from '@/entities/mongo/Transaction';
import {
    AppointmentInput,
    TransactionInput,
} from '@/modules/mongo/appointment/AppointmentInput';

@Resolver(() => Appointment)
export class AppointmentResolver {
    private repository: MongoRepository<Appointment>;

    constructor(private readonly mongoService: MongoService) {
        this.repository = this.mongoService.getRepository(Appointment);
    }
    @Query(() => [Appointment])
    async getAppointments(): Promise<Appointment[]> {
        return this.repository.find();
    }

    @Query(() => Appointment, { nullable: true })
    async getAppointmentsByUser(
        @Arg('appointmentInput') { userId }: AppointmentInput
    ): Promise<Appointment[]> {
        if (!userId) {
            return Promise.reject(new Error('Missing User ID'));
        }
        return this.repository.find({ userId });
    }

    @Mutation(() => Appointment)
    @UseMiddleware(isAuth)
    async createAppointment(
        @Ctx() { payload }: MyContext,
        @Arg('title') title: string
    ): Promise<Appointment> {
        const userId = payload?.userId;
        if (!userId) {
            return Promise.reject(Error('Missing User ID in Context'));
        }

        const appointment = new Appointment(userId, title);
        return this.repository.save(appointment);
    }

    @Mutation(() => Appointment)
    @UseMiddleware(isAuth)
    async addTransaction(
        @Ctx() { payload }: MyContext,
        @Arg('appointmentId') { _id }: AppointmentInput,
        @Arg('transactionInput') { price, description }: TransactionInput
    ): Promise<Appointment> {
        const userId = payload?.userId;
        if (!userId) {
            return Promise.reject(new Error('Missing User ID'));
        }
        const appointment = await this.repository.findOne({ _id, userId });
        if (!appointment) {
            return Promise.reject(
                new Error(`No Appointment ID ${_id} for User ID ${userId}`)
            );
        }
        appointment.transactions.push(new Transaction(price, description));
        return this.repository.save(appointment);
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteAppointment(
        @Ctx() { payload }: MyContext,
        @Arg('appointmentId') { _id }: AppointmentInput
    ): Promise<DeleteWriteOpResultObject> {
        const userId = payload?.userId;
        if (!userId) {
            return Promise.reject(Error('Missing User ID in Context'));
        }
        const appointment = await this.repository.findOne({ _id, userId });
        if (!appointment) {
            return Promise.reject(
                new Error(`No Appointment ID ${_id} for User ID ${userId}`)
            );
        }
        return this.repository.deleteOne(appointment);
    }
}
