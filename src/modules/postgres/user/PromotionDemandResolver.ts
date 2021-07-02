import {
    Resolver,
    Mutation,
    Arg,
    Query,
    UseMiddleware,
    Ctx,
    Authorized,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { Service } from 'typedi';

import { MyContext } from '@/types/MyContext';
import { isAuth } from '@/middlewares/isAuth';
import { PostgresService } from '@/services/repositories/postgres-service';
import {
    PromotionDemand,
    ReviewStatus,
} from '@/entities/postgres/PromotionDemand';
import { User, UserRole } from '@/entities/postgres/User';
import { PromotionInput, DemandeStatusInput } from './PromotionInput';

@Resolver(() => PromotionDemand)
@Service()
export class PromotionDemandResolver {
    private promotionRepository: Repository<PromotionDemand>;
    private userRepository: Repository<User>;

    constructor(private readonly postgresService: PostgresService) {
        this.promotionRepository =
            this.postgresService.getRepository(PromotionDemand);
        this.userRepository = this.postgresService.getRepository(User);
    }

    @Query(() => [PromotionDemand])
    @UseMiddleware(isAuth)
    @Authorized([UserRole.MODERATOR, UserRole.ADMIN])
    async getDemands(): Promise<PromotionDemand[]> {
        return this.promotionRepository
            .createQueryBuilder('promotionDemand')
            .leftJoinAndSelect('promotionDemand.user', 'user')
            .getMany();
    }

    @Query(() => [PromotionDemand])
    @UseMiddleware(isAuth)
    @Authorized([UserRole.MODERATOR, UserRole.ADMIN])
    async getDemand(): Promise<PromotionDemand[]> {
        return this.promotionRepository
            .createQueryBuilder('promotionDemand')
            .leftJoinAndSelect('promotionDemand.user', 'user')
            .getMany();
    }

    @Mutation(() => PromotionDemand)
    @UseMiddleware(isAuth)
    @Authorized([UserRole.USER])
    async makeDemand(@Ctx() { payload }: MyContext): Promise<PromotionDemand> {
        const user = await this.promotionRepository.findOne(payload?.userId);
        if (!user) {
            throw new Error('Could not find user');
        }
        return this.promotionRepository.create({ user }).save();
    }

    @Mutation(() => User)
    @UseMiddleware(isAuth)
    @Authorized([UserRole.MODERATOR, UserRole.ADMIN])
    async updateRole(
        @Ctx() { payload: currentUser }: MyContext,
        @Arg('promotion') { id, role }: PromotionInput
    ): Promise<User> {
        const user = (await this.userRepository.findOne({ id })) as User;
        if (
            currentUser?.role === UserRole.MODERATOR &&
            (user.role === UserRole.MODERATOR || user.role === UserRole.ADMIN)
        ) {
            throw new Error(
                'Access denied! Action not permitted for this user'
            );
        }
        if (
            currentUser?.role === UserRole.MODERATOR &&
            (role === UserRole.MODERATOR || role === UserRole.ADMIN)
        ) {
            throw new Error(
                "Access denied! You don't have permission for this action!"
            );
        }
        user.role = role;

        return this.userRepository.save(user);
    }

    @Mutation(() => PromotionDemand)
    @UseMiddleware(isAuth)
    @Authorized([UserRole.ADMIN, UserRole.MODERATOR])
    async updateDemandStatus(
        @Arg('demand') { id, reviewStatus }: DemandeStatusInput
    ): Promise<PromotionDemand> {
        const user = (await this.userRepository.findOne({ id })) as User;
        if (
            reviewStatus === ReviewStatus.ACCEPTED ||
            reviewStatus === ReviewStatus.REVOKED
        ) {
            user.role = ReviewStatus.ACCEPTED ? UserRole.FURRAX : UserRole.USER;
            await this.userRepository.save(user);
        }
        return this.promotionRepository
            .update({ user }, { reviewStatus })
            .then((result) => result.raw[0]);
    }
}
