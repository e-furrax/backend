import { AuthChecker } from 'type-graphql';
import { MyContextPayload } from '@/types/MyContext';
import { verify } from 'jsonwebtoken';

export const customAuthChecker: AuthChecker<any> = ({ context }) => {
    const authorization = context.extended['Authorization'];
    if (!authorization) {
        return false;
    }

    try {
        const token = authorization.split(' ')[1];
        const payload = verify(token, 's3cr3tk3y') as MyContextPayload;
        context.payload = payload;
    } catch (err) {
        return false;
    }

    return true;
};
