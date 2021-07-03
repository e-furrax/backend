import {
    Resolver,
    Query,
    Mutation,
    Arg,
    Ctx,
    UseMiddleware,
    Authorized,
} from 'type-graphql';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { MongoRepository, Repository } from 'typeorm';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { MyContext } from '@/types/MyContext';
import { isAuth } from '@/middlewares/isAuth';
import { MongoService } from '@/services/repositories/mongo-service';

import { User, UserRole } from '@/entities/postgres/User';
import { Appointment, AppointmentStatus } from '@/entities/mongo/Appointment';
import { Transaction, TransactionStatus } from '@/entities/mongo/Transaction';
import {
    AppointmentInput,
    AppointmentIdsInput,
    TransactionInput,
} from '@/modules/mongo/appointment/AppointmentInput';
import {
    sendAppointmentEmail,
    sendCancelAppointmentEmail,
} from '@/utils/sendEmail';
import { PostgresService } from '@/services/repositories/postgres-service';
dayjs.extend(localizedFormat);

@Service()
@Resolver(() => Appointment)
export class AppointmentResolver {
    private appointmentRepository: MongoRepository<Appointment>;
    private transactionRepository: MongoRepository<Transaction>;
    private userRepository: Repository<User>;

    constructor(
        private readonly mongoService: MongoService,
        private readonly postgresService: PostgresService
    ) {
        this.appointmentRepository =
            this.mongoService.getRepository(Appointment);
        this.transactionRepository =
            this.mongoService.getRepository(Transaction);
        this.userRepository = this.postgresService.getRepository(User);
    }
    @Query(() => [Appointment])
    @Authorized([UserRole.MODERATOR, UserRole.ADMIN])
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
        @Arg('appointmentInput')
        { from, to, date, description, matches, game }: AppointmentInput
    ): Promise<Appointment> {
        const fromUser = from || payload?.userId; // User ID is given by request parameter ex: admin created appointment or by token ex: User created appointment
        if (!fromUser) {
            return Promise.reject(Error('Missing User ID'));
        }

        const user = await this.userRepository.findOne(fromUser);
        const furrax = await this.userRepository.findOne(to);

        const appointment = this.appointmentRepository.create({
            from: fromUser,
            to,
            date,
            description,
            matches,
            game,
        });

        try {
            const savedAppointment = await this.appointmentRepository.save(
                appointment
            );
            if (user && furrax) {
                sendAppointmentEmail(
                    user.email,
                    furrax.email,
                    user.username,
                    furrax.username,
                    dayjs(savedAppointment._createdAt).format('L LT')
                );
            }
            return savedAppointment;
        } catch (error) {
            return Promise.reject(new Error(error));
        }
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

    @Mutation(() => Boolean)
    @Authorized([UserRole.ADMIN, UserRole.FURRAX, UserRole.MODERATOR])
    async deleteAppointment(
        @Arg('payload') { ids }: AppointmentIdsInput
    ): Promise<boolean> {
        try {
            const appointmentIds = ids.map((id) => ({
                _id: ObjectId.createFromHexString(id),
            }));
            const { result } = await this.appointmentRepository.updateMany(
                { $or: [...appointmentIds] },
                {
                    $set: {
                        status: AppointmentStatus.CANCELLED,
                        'transactions.$[elem].status':
                            TransactionStatus.CANCELLED,
                    },
                },
                {
                    arrayFilters: [
                        { 'elem.status': TransactionStatus.PENDING },
                    ],
                    upsert: false,
                } as any
            );

            const deletedAppointments =
                await this.appointmentRepository.findByIds(appointmentIds);

            const promises = deletedAppointments.map(
                async ({ from, to, date }) => ({
                    from: await this.userRepository.findOne(from, {
                        select: ['email', 'username'],
                    }),
                    to: await this.userRepository.findOne(to, {
                        select: ['email', 'username'],
                    }),
                    date,
                })
            );

            const mappedAppointments = await Promise.all(promises);

            mappedAppointments.forEach((appointment) => {
                if (appointment.from && appointment.to) {
                    sendCancelAppointmentEmail(
                        appointment.from,
                        appointment.to,
                        dayjs(appointment.date).format('L LT')
                    );
                }
            });

            // Return could be more explicit
            return !!result.ok;
        } catch (e) {
            return false;
        }
    }
}
