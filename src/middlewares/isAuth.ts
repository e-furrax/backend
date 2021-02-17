import { verify } from 'jsonwebtoken';
import { MyContext, MyContextPayload } from '../MyContext';
import { MiddlewareFn } from 'type-graphql';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
	const authorization = context.req.headers['authorization'];

	if (!authorization) {
		throw new Error('Not authenticated');
	}

	try {
		const token = authorization.split(' ')[1];
		const payload = verify(token, 's3cr3tk3y') as MyContextPayload;
		context.payload = payload;
	} catch (err) {
		throw new Error('Not authenticated');
	}
	return next();
};
