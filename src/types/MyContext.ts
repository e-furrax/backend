import { Request, Response } from 'express';

export interface MyContext {
    req: Request;
    res: Response;
    payload?: MyContextPayload;
}

export interface MyContextPayload {
    userId: number;
}
