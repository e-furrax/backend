import { Service, Inject } from 'typedi';
import { Connection, Repository } from 'typeorm';

@Service()
export class PostgresService {
    constructor(
        @Inject('POSTGRES_MANAGER') private readonly manager: Connection
    ) {}

    public getRepository(entity: any): Repository<any> {
        return this.manager.getRepository(entity);
    }
}
