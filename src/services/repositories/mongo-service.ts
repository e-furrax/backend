import { Service, Inject } from 'typedi';
import { Connection, MongoRepository } from 'typeorm';

interface Repositories {
    readonly entity: string;
    readonly repository: MongoRepository<any>;
}

@Service()
export class MongoService {
    private repositories: Repositories[] = [];

    constructor(@Inject('MONGO_MANAGER') private readonly manager: Connection) {
        console.log('Mongo_manager instanciated');
    }

    public getRepository(entity: any): MongoRepository<any> {
        let repository = this.repositories.find(
            ({ entity }) => entity === entity.constructor.name
        )?.repository;
        if (!repository) {
            repository = this.manager.getMongoRepository(entity);
            this.repositories.push({
                entity: entity.constructor.name,
                repository,
            });
        }
        return repository;
    }
}
