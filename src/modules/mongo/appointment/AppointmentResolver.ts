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
import { MongoRepository } from 'typeorm';

import { MyContext } from '@/types/MyContext';
import { isAuth } from '@/middlewares/isAuth';
import { MongoService } from '@/services/repositories/mongo-service';

import { Appointment } from '@/entities/mongo/Appointment';
import { Transaction } from '@/entities/mongo/Transaction';
import {
    AppointmentInput,
    AppointmentIdsInput,
    TransactionInput,
} from '@/modules/mongo/appointment/AppointmentInput';
import { AppointmentStatus } from '@/services/enum/appointmentStatus';
import { TransactionStatus } from '@/services/enum/transactionStatus';

@Service()
@Resolver(() => Appointment)
export class AppointmentResolver {
    private appointmentRepository: MongoRepository<Appointment>;
    private transactionRepository: MongoRepository<Transaction>;

    constructor(private readonly mongoService: MongoService) {
        this.appointmentRepository =
            this.mongoService.getRepository(Appointment);
        this.transactionRepository =
            this.mongoService.getRepository(Transaction);
    }
    @Query(() => [Appointment])
    async getAppointments(): Promise<Appointment[]> {
        return this.appointmentRepository.find();
    }

    @Query(() => [Appointment], { nullable: true })
    async getAppointmentsByUser(
        @Arg('from') from: number
    ): Promise<Appointment[]> {
        if (!from) {
            return Promise.reject(new Error('Missing User ID'));
        }
        return this.appointmentRepository.find({ from });
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
        return this.appointmentRepository.save(appointment);
    }

    @Mutation(() => Appointment)
    @UseMiddleware(isAuth)
    async addTransaction(
        @Arg('appointmentId') id: string,
        @Arg('transactionInput') { price, description }: TransactionInput
    ): Promise<Appointment> {
        const _id = ObjectId.createFromHexString(id);
        const transaction = await this.transactionRepository.save(
            new Transaction(price, description)
        );
        const { value: updatedAppointment, lastErrorObject } =
            await this.appointmentRepository.findOneAndUpdate(
                { _id },
                {
                    $push: {
                        transactions: transaction,
                    },
                },
                { returnOriginal: false }
            );

        if (!lastErrorObject?.updatedExisting) {
            return Promise.reject(
                new Error(
                    `Error could not execute the operation. Details: ${lastErrorObject}`
                )
            );
        }
        return updatedAppointment;
    }

    @Mutation(() => [Appointment])
    deleteAppointment(
        @Arg('payload') { ids }: AppointmentIdsInput
    ): Promise<Appointment[]> {
        return Promise.all(
            ids.map(async (id: string) => {
                const _id = ObjectId.createFromHexString(id);
                const appointment = await this.appointmentRepository.findOne({
                    _id,
                });

                if (!appointment) {
                    return Promise.reject(
                        new Error(`No Appointment ID ${_id}.`)
                    );
                }
                // TODO: UPDATE MULTIPLE TRANSACTION STATUS AT ONCE
                return this.appointmentRepository.findOneAndUpdate(
                    { _id, 'transactions.status': TransactionStatus.PENDING },
                    {
                        $set: {
                            status: AppointmentStatus.CANCELLED,
                            'transactions.$.status':
                                TransactionStatus.CANCELLED,
                        },
                    },
                    { returnOriginal: false }
                );
            })
        ).then((updatedAppointments) => {
            const res = updatedAppointments
                .filter((appointment) => appointment.value !== null)
                .map((res) => res.value);
            return res;
        });
    }
}
