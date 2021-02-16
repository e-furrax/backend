import { Resolver, Query, FieldResolver, Arg, Root, Mutation, Ctx, Int } from "../../../src";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Context } from "../index";
import { Game } from "../entities/game";
import { Rate } from "../entities/rate";
import { User } from "../entities/user";
import { GameInput } from "./types/game-input";
import { RateInput } from "./types/rate-input";

@Resolver(of => Game)
export class GameResolver {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Recipe>,
    @InjectRepository(Rate) private readonly ratingsRepository: Repository<Rate>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Query(returns => Game, { nullable: true })
  game(@Arg("recipeId", type => Int) recipeId: number) {
    return this.gameRepository.findOne(recipeId);
  }

  @Query(returns => [Game])
  games(): Promise<Game[]> {
    return this.gameRepository.find();
  }

  @Mutation(returns => Game)
  async addGame(
    @Arg("game") recipeInput: GameInput,
    @Ctx() { user }: Context,
  ): Promise<Game> {
    const game = this.gameRepository.create({
      ...gameInput,
      authorId: user.id,
    });
    return await this.gameRepository.save(game);
  }

  @Mutation(returns => Game)
  async rate(@Arg("rate") rateInput: RateInput, @Ctx() { user }: Context): Promise<Game> {
    // find the game
    const game = await this.gameRepository.findOne(rateInput.gameId, {
      relations: ["ratings"],
    });
    if (!game) {
      throw new Error("Invalid game ID");
    }

    // set the new game rate
    const newRate = this.ratingsRepository.create({
      game,
      value: rateInput.value,
      user,
    });
    game.ratings.push(newRate);

    // update the game
    await this.gameRepository.save(game);
    return game;
  }

  @FieldResolver()
  ratings(@Root() game: Game) {
    return this.ratingsRepository.find({
      cache: 1000,
      where: { game: { id: game.id } },
    });
  }

  @FieldResolver()
  async author(@Root() game: Game): Promise<User> {
    return (await this.userRepository.findOne(game.authorId, { cache: 1000 }))!;
  }
}