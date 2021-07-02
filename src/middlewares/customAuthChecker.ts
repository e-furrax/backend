import { AuthChecker } from 'type-graphql';
import { MyContextPayload } from '@/types/MyContext';
import { verify } from 'jsonwebtoken';

export const customAuthChecker: AuthChecker<any> = ({ context }, roles) => {
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
        userRole = payload.role;
        context.payload = payload;
    } catch (err) {
        return false;
    }

    return !roles.length || roles.includes(userRole);
};
