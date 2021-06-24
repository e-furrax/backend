import { Language } from '@/entities/postgres/Language';
import { Repository } from 'typeorm';
import { PostgresService } from '@/services/repositories/postgres-service';
import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { InsertLanguageInput } from './InsertLanguageInput';

import { Service } from 'typedi';
@Service()
@Resolver()
export class LanguageResolver {
    private repository: Repository<Language>;

    constructor(private readonly postgresService: PostgresService) {
        this.repository = this.postgresService.getRepository(Language);
    }

    @Query(() => [Language])
    async getLanguages() {
        return await this.repository.find();
    }

    @Mutation(() => Language)
    async createLanguage(
        @Arg('data') data: InsertLanguageInput
    ): Promise<Language> {
        const language = await this.repository
            .create({
                ...data,
            })
            .save();

        return language;
    }

    @Mutation(() => Boolean)
    async deleteLanguage(@Arg('id') id: number): Promise<boolean> {
        const language = await this.repository.findOne(id);
        if (!language) {
            throw new Error(`Language "${id}" not found.`);
        }
        await this.repository.remove(language);

        return true;
    }

    @Mutation(() => Language)
    async updateLanguage(
        @Arg('id') id: number,
        @Arg('data') data: InsertLanguageInput
    ) {
        const language = await this.repository.findOne(id);
        if (!language) {
            throw new Error(`Language "${id}" not found.`);
        }
        Object.assign(language, data);
        await this.repository.save(language);

        return language;
    }
}
