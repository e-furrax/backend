import { getRepository } from "typeorm";

import { Game } from "./entities/game";
import { Rate } from "./entities/rate";
import { User } from "./entities/user";

export async function seedDatabase() {
  const gameRepository = getRepository(Game);
  const ratingsRepository = getRepository(Rate);
  const userRepository = getRepository(User);

  const defaultUser = userRepository.create({
    email: "test@github.com",
    nickname: "Testest",
    password: "s3cr3tp4ssw0rd",
  });
  await userRepository.save(defaultUser);

  const games = gameRepository.create([
    {
      title: "Game 1",
      description: "Desc 1",
      author: defaultUser,
      ratings: ratingsRepository.create([
        { value: 2, user: defaultUser },
        { value: 4, user: defaultUser },
        { value: 5, user: defaultUser },
        { value: 3, user: defaultUser },
        { value: 4, user: defaultUser },
      ]),
    },
    {
      title: "Game 2",
      author: defaultUser,
      ratings: ratingsRepository.create([
        { value: 2, user: defaultUser },
        { value: 4, user: defaultUser },
      ]),
    },
  ]);
  await gameRepository.save(games);

  return {
    defaultUser,
  };
}