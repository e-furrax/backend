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
import { MongoService } from '@/services/repositories/mongo-service';

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
        this.repositoryAppointment =
            this.mongoService.getRepository(Appointment);
        this.repositoryTransaction =
            this.mongoService.getRepository(Transaction);
    }
    @Query(() => [Appointment])
    async getAppointments(): Promise<Appointment[]> {
        return this.repositoryAppointment.find();
    }

    @Query(() => [Appointment], { nullable: true })
    async getAppointmentsByUser(
        @Arg('from') from: number
    ): Promise<Appointment[]> {
        if (!from) {
            return Promise.reject(new Error('Missing User ID'));
        }
        return this.repositoryAppointment.find({ from });
    }

    @Mutation(() => Appointment)
    @UseMiddleware(isAuth)
    async createAppointment(
        @Ctx() { payload }: MyContext,
        @Arg('appointmentInput') { title, from, to }: AppointmentInput
    ): Promise<Appointment> {
        const fromUser = from || payload?.userId; // User ID is given by request parameter ex: admin created appointment or by token ex: User created appointment
        if (!fromUser) {
            return Promise.reject(Error('Missing User ID'));
        }

        const appointment = new Appointment(fromUser, to, title);
        return this.repositoryAppointment.save(appointment);
    }

    @Mutation(() => Appointment)
    @UseMiddleware(isAuth)
    async addTransaction(
        @Arg('appointmentId') id: string,
        @Arg('transactionInput') { price, description }: TransactionInput
    ): Promise<Appointment> {
        const _id = ObjectId.createFromHexString(id);
        const transaction = await this.repositoryTransaction.save(
            new Transaction(price, description)
        );
        const result = await this.repositoryAppointment.findOneAndUpdate(
            { _id },
            {
                $push: {
                    transactions: transaction,
                },
            },
            { returnOriginal: false }
        );

        if (!result.lastErrorObject.updatedExisting) {
            return Promise.reject(new Error(`No Appointment ID ${id} found.`));
        }
        return result.value;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteAppointment(
        @Arg('appointmentId') id: string
    ): Promise<DeleteWriteOpResultObject> {
        const _id = ObjectId.createFromHexString(id);
        const appointment = await this.repositoryAppointment.findOne({
            _id,
        });
        if (!appointment) {
            return Promise.reject(new Error(`No Appointment ID ${_id}.`));
        }
        return this.repositoryAppointment.deleteOne(appointment);
    }
}
