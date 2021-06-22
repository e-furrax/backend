import {
    Resolver,
    Mutation,
    Arg,
    UseMiddleware,
    Ctx,
    Query,
    Subscription,
    Root,
    PubSub,
    PubSubEngine,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { Service } from 'typedi';

import { isAuth } from '@/middlewares/isAuth';
import { MyContext } from '@/types/MyContext';
import { PostgresService } from '@/services/repositories/postgres-service';
import { Rating } from '@/entities/postgres/Rating';
import { User } from '@/entities/postgres/User';
import { RatingInput } from './RatingInput';
import { RatingNotification } from './RatingNotification';

@Resolver(() => Rating)
@Service()
export class RatingResolver {
    private repository: Repository<Rating>;
    private userRepository: Repository<User>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(Rating);
        this.userRepository = this.postgresService.getRepository(User);
    }

    @Mutation(() => Rating)
    @UseMiddleware(isAuth)
    async addRating(
        @Ctx() { payload }: MyContext,
        @Arg('data') { comments, rating, toUser }: RatingInput,
        @PubSub() pubSub: PubSubEngine
    ): Promise<Rating> {
        const user = await this.userRepository.findOne(payload?.userId);
        if (!user) {
            throw new Error('Could not find user');
        }
        const newRating = await this.repository.create({
            rating,
            comments,
            fromUser: user,
            toUser,
        });

        await this.repository.save(newRating);

        const eagerLoadedRating = await this.repository.findOne(newRating.id, {
            relations: ['fromUser', 'toUser'],
        });
        if (!eagerLoadedRating) {
            throw new Error('Could not find rating');
        }

        await pubSub.publish('NEW_RATING', eagerLoadedRating);

        return eagerLoadedRating;
    }

    @Query(() => [Rating])
    async getRatings() {
        return await this.repository.find({
            relations: ['fromUser', 'toUser'],
        });
    }

    @Subscription(() => Rating, { topics: 'NEW_RATING' })
    newRating(
        @Root() notificationPayload: RatingNotification
    ): RatingNotification {
        return { ...notificationPayload };
    }
}
