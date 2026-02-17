import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return next({
                    statusCode: 400,
                    message: error.errors.map(e => e.message).join(', '),
                    errorCode: 'VALIDATION_ERROR',
                } as any);
            }
            next(error);
        }
    };
};
