import { AuthChecker } from 'type-graphql';
import { MyContextPayload } from '@/types/MyContext';
import { verify } from 'jsonwebtoken';
import { UserRole } from '@/entities/postgres/User';
import { Container } from 'typedi';
import { Connection } from 'typeorm';
import { User } from '@/entities/postgres/User';

export const customAuthChecker: AuthChecker<any> = async (
    { context },
    roles
) => {
    const authorization =
        context.req?.headers?.authorization ||
        context.extended?.['authorization'];
    if (!authorization) {
        return false;
    }

    let userRole;
    try {
        const token = authorization.split(' ')[1];
        const payload = verify(token, 's3cr3tk3y') as MyContextPayload;
        const postgres = Container.get('POSTGRES_MANAGER') as Connection;
        const user = await postgres
            .getRepository(User)
            .findOne({ where: { id: payload.userId } })
            .then((user) => user);
        userRole = user?.role || '';
        payload.role = userRole;
        context.payload = payload;
    } catch (err) {
        return false;
    }

    return (
        !(userRole === UserRole.BANNED) &&
        (!roles.length || roles.includes(userRole))
    );
};
