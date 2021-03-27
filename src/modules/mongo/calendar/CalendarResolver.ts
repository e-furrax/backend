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
import { AppointmentInput } from './AppointmentInput';
import { MyContext } from '@/types/MyContext';
import { Appointment } from '@/entities/mongo/Appointment';
import { isAuth } from '@/middlewares/isAuth';

@Resolver()
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
    async createCalendar(@Arg('userId') userId: number): Promise<Calendar> {
        const calendar: Calendar = new CalendarModel({
            userId,
            appointments: [],
        }).save();

        return calendar;
    }

    @Mutation(() => Calendar)
    @UseMiddleware(isAuth)
    async addAppointment(
        @Arg('data') data: AppointmentInput,
        @Ctx() { payload }: MyContext
    ): Promise<Calendar> {
        return new Promise((resolve, reject) => {
            CalendarModel.findOne(
                { userId: payload?.userId },
                (err: any, calendar: DocumentType<Calendar>) => {
                    if (err) {
                        reject(new Error(err));
                        return;
                    }

                    if (!calendar) {
                        reject(
                            new Error(
                                `Calendar for user ${payload?.userId} not found.`
                            )
                        );
                        return;
                    }

                    const appointment: Appointment = {
                        userId: data.userId,
                        date: new Date(),
                        price: data.price,
                    };

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
