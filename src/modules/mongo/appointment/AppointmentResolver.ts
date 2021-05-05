import {
    Resolver,
    Query,
    Mutation,
    Arg,
    Ctx,
    UseMiddleware,
} from 'type-graphql';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { DeleteWriteOpResultObject, MongoRepository } from 'typeorm';

import { MyContext } from '@/types/MyContext';
import { isAuth } from '@/middlewares/isAuth';
import { MongoService } from '@/services/mongo-service';

import { Appointment } from '@/entities/mongo/Appointment';
import { Transaction } from '@/entities/mongo/Transaction';
import {
    AppointmentInput,
    TransactionInput,
} from '@/modules/mongo/appointment/AppointmentInput';

@Service()
@Resolver(() => Appointment)
export class AppointmentResolver {
    private repositoryAppointment: MongoRepository<Appointment>;
    private repositoryTransaction: MongoRepository<Transaction>;

    constructor(private readonly mongoService: MongoService) {
        this.repositoryAppointment = this.mongoService.getRepository(
            Appointment
        );
        this.repositoryTransaction = this.mongoService.getRepository(
            Transaction
        );
    }
    @Query(() => [Appointment])
    async getAppointments(): Promise<Appointment[]> {
        return this.repositoryAppointment.find();
    }

    @Query(() => [Appointment], { nullable: true })
    async getAppointmentsByUser(
        @Arg('userId') userId: number
    ): Promise<Appointment[]> {
        if (!userId) {
            return Promise.reject(new Error('Missing User ID'));
        }
        return this.repositoryAppointment.find({ userId });
    }

    @Mutation(() => Appointment)
    @UseMiddleware(isAuth)
    async createAppointment(
        @Ctx() { payload }: MyContext,
        @Arg('title') { title }: AppointmentInput
    ): Promise<Appointment> {
        const userId = payload?.userId;
        if (!userId) {
            return Promise.reject(Error('Missing User ID in Context'));
        }

        const appointment = new Appointment(userId, title);
        return this.repositoryAppointment.save(appointment);
    }

    @Mutation(() => Appointment)
    @UseMiddleware(isAuth)
    async addTransaction(
        @Ctx() { payload }: MyContext,
        @Arg('appointmentId') id: string,
        @Arg('transactionInput') { price, description }: TransactionInput
    ): Promise<Appointment> {
        const userId = payload?.userId;
        if (!userId) {
            return Promise.reject(new Error('Missing User ID'));
        }
        const _id = ObjectId.createFromHexString(id);
        const transaction = await this.repositoryTransaction.save(
            new Transaction(price, description)
        );
        const result = await this.repositoryAppointment.findOneAndUpdate(
            { _id, userId },
            {
                $push: {
                    transactions: transaction,
                },
            },
            { returnOriginal: false }
        );

        if (!result.lastErrorObject.updatedExisting) {
            return Promise.reject(
                new Error(`No Appointment ID ${id} for User ID ${userId} found`)
            );
        }
        return result.value;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteAppointment(
        @Ctx() { payload }: MyContext,
        @Arg('appointmentId') id: string
    ): Promise<DeleteWriteOpResultObject> {
        const userId = payload?.userId;
        if (!userId) {
            return Promise.reject(new Error('Missing User ID in Context'));
        }
        const _id = ObjectId.createFromHexString(id);
        const appointment = await this.repositoryAppointment.findOne({
            _id,
            userId,
        });
        if (!appointment) {
            return Promise.reject(
                new Error(`No Appointment ID ${_id} for User ID ${userId}`)
            );
        }
        return this.repositoryAppointment.deleteOne(appointment);
    }
}
