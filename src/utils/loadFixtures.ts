import { Availability } from '@/entities/postgres/Availability';
import { Status, User } from '@/entities/postgres/User';
import * as path from 'path';
import { Connection, Repository } from 'typeorm';
import faker from 'faker';
import {
    Builder,
    fixturesIterator,
    Loader,
    Parser,
    Resolver,
} from 'typeorm-fixtures-cli/dist';
import { Rating } from '@/entities/postgres/Rating';

const generateRandomRatings = async (
    userRepository: Repository<User>,
    ratingRepository: Repository<Rating>,
    fromUser: User,
    usersLength: number
) => {
    const generatedRatings = [];
    const numberOfRatings = faker.datatype.number({ min: 1, max: 10 });
    for (let i = 0; i <= numberOfRatings; i++) {
        const randomToUserId = faker.datatype.number({
            min: 1,
            max: usersLength - 1,
        });
        const toUser = await userRepository.findOne(randomToUserId);
        if (toUser) {
            const newRating = new Rating();
            newRating.rating = JSON.stringify(
                faker.datatype.number({ min: 2, max: 5 })
            );
            newRating.comments = faker.lorem.paragraph();
            newRating.fromUser = fromUser;
            newRating.toUser = toUser;
            newRating.createdAt = faker.date.recent();
            generatedRatings.push(ratingRepository.save(newRating));
        }
    }
    return await Promise.all(generatedRatings);
};

export const loadFixtures = async (connection: Connection) => {
    const loader = new Loader();
    loader.load(path.resolve('./src/fixtures'));
    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser());
    const fx = [];
    for (const fixture of fixturesIterator(fixtures)) {
        const entity = await builder.build(fixture);
        const repository = connection.getRepository(entity.constructor.name);
        if (entity.constructor.name === 'User') {
            const user = await repository.save(entity);
            const availabilityRepository =
                connection.getRepository('Availability');
            const availabilityToSave = new Availability();
            const availability = await availabilityRepository.save(
                availabilityToSave
            );
            user.availability = availability;
            user.status = Status.VERIFIED;
            fx.push(repository.save(user));
        } else {
            fx.push(repository.save(entity));
        }
    }

    await Promise.all(fx).then(() =>
        console.log('\x1b[32m%s\x1b[0m', 'Fixtures are successfully loaded.')
    );

    const userRepository = connection.getRepository('User') as Repository<User>;
    const users = (await userRepository.find()) as User[];
    const ratingRepository = connection.getRepository(
        'Rating'
    ) as Repository<Rating>;
    for (const user of users) {
        await generateRandomRatings(
            userRepository,
            ratingRepository,
            user,
            users.length
        );
    }
};
