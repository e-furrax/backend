import { Calendar, CalendarModel } from '@/entities/mongo/Calendar';
import {
    Resolver,
    Query,
    Mutation,
    Arg,
    Ctx,
    UseMiddleware,
} from 'type-graphql';
import { DocumentType } from '@typegoose/typegoose';
import { CalendarInput } from './CalendarInput';
import { MyContext } from '@/types/MyContext';
import { AppointmentModel } from '@/entities/mongo/Appointment';
import { isAuth } from '@/middlewares/isAuth';
import { AppointmentInput } from './AppointmentInput';

@Resolver(() => Calendar)
export class CalendarResolver {
    @Query(() => [Calendar])
    async getCalendars() {
        return await CalendarModel.find();
    }

    @Query(() => Calendar, { nullable: true })
    async getCalendar(@Arg('data') data: CalendarInput) {
        return await CalendarModel.findOne({ ...data });
    }

    @Mutation(() => Calendar)
    @UseMiddleware(isAuth)
    async createCalendar(@Ctx() { payload }: MyContext): Promise<Calendar> {
        const userId = payload?.userId;
        if (!userId) {
            return Promise.reject(Error('Missing User ID in Context'));
        }
        const calendar = new CalendarModel({
            userId,
            appointments: [],
        });
        await calendar.save();

        return calendar;
    }

    @Mutation(() => Calendar)
    @UseMiddleware(isAuth)
    async addAppointment(
        @Ctx() { payload }: MyContext,
        @Arg('appointmentInput') { title }: AppointmentInput
    ): Promise<Calendar> {
        return new Promise((resolve, reject) => {
            const userId = payload?.userId;
            if (!userId) {
                reject(new Error('Missing User ID'));
                return;
            }

            CalendarModel.findOne(
                { userId },
                (err: any, calendar: DocumentType<Calendar> | null) => {
                    if (err) {
                        return reject(new Error(err));
                    }

                    if (!calendar) {
                        return reject(
                            new Error(
                                `Calendar for User ID ${userId} not found.`
                            )
                        );
                    }
                    const appointment = new AppointmentModel({
                        title,
                        date: new Date(),
                        transactions: [],
                        calendar: calendar._id,
                    });
                    console.log(appointment.toString());

                    calendar.appointments.push(appointment);
                    calendar.save();
                    resolve(calendar);
                }
            );
        });
    }

    @Mutation(() => Boolean)
    async deleteCalendar(@Arg('userId') userId: number): Promise<boolean> {
        const calendar = await CalendarModel.findOne({ userId });
        if (!calendar) {
            throw new Error(`Calendar for user ${userId} does not exist`);
        }
        await calendar.remove();

        return true;
    }
}
