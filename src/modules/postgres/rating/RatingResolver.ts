import {
    Resolver,
    Mutation,
    Arg,
    UseMiddleware,
    Ctx,
    Query,
    Authorized,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { isAuth } from '@/middlewares/isAuth';
import { MyContext } from '@/types/MyContext';
import { PostgresService } from '@/services/repositories/postgres-service';
import { Rating } from '@/entities/postgres/Rating';
import { User, UserRole } from '@/entities/postgres/User';
import { RatingInput, RatingIdsInput } from './RatingInput';

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
        @Arg('data') { comments, rating, toUser }: RatingInput
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

        return eagerLoadedRating;
    }

    @Query(() => [Rating])
    async getRatings() {
        return await this.repository.find({
            relations: ['fromUser', 'toUser'],
        });
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    @Authorized([UserRole.MODERATOR, UserRole.ADMIN])
    async removeRating(
        @Arg('ratings') { ids }: RatingIdsInput
    ): Promise<boolean> {
        return this.repository.delete(ids).then(({ affected }) => !!affected);
    }
}
