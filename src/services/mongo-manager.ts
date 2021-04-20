import { Service, Inject } from 'typedi';
import { Connection, MongoRepository } from 'typeorm';

@Service()
export class MongoService {
    constructor(
        @Inject('MONGO_MANAGER') private readonly manager: Connection
    ) {}

    public getRepository(entity: any): MongoRepository<any> {
        return this.manager.getMongoRepository(entity);
    }
}
