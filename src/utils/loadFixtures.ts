import * as path from 'path';
import { Connection } from 'typeorm';
import {
    Builder,
    fixturesIterator,
    Loader,
    Parser,
    Resolver,
} from 'typeorm-fixtures-cli/dist';

export const loadFixtures = async (connection: Connection) => {
    const loader = new Loader();
    loader.load(path.resolve('./src/fixtures'));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(connection, new Parser());
    const fx = [];
    for (const fixture of fixturesIterator(fixtures)) {
        const entity = await builder.build(fixture);
        fx.push(connection.getRepository(entity.constructor.name).save(entity));
    }
    await Promise.all(fx).then(() =>
        console.log('\x1b[32m%s\x1b[0m', 'Fixtures are successfully loaded.')
    );
};
