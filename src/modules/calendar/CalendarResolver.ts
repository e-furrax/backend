import { Calendar, CalendarModel } from '../../entities/Calendar';
import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { CalendarInput } from './CalendarInput';

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
			appointments: []
		}).save();

		return calendar;
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
