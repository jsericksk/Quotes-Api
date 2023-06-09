import { Response, NextFunction, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, z } from "zod";

type Property = "body" | "header" | "params" | "query";

type AllSchemas = Record<Property, z.ZodType<any>>;

type CustomSchema = <T>(schema: z.ZodType<T>) => z.ZodType<T>

type Schemas = (customSchema: CustomSchema) => Partial<AllSchemas>;

export function zodValidation(schemas: Schemas) {
    return (req: Request, res: Response, next: NextFunction) => {
        const schema = schemas((schema) => schema);
        const validationErrors: Record<string, Record<string, string>> = {};

        Object.entries(schema).forEach(([property, schema]) => {
            const errors: Record<string, string> = {};
            try {
                schema.parse(req[property as Property]);
            } catch (error) {
                const zodError = error as ZodError;
                zodError.errors.forEach((error) => {
                    errors[error.path[0]] = error.message;
                });
                validationErrors[property as Property] = errors;
            }
        });

        if (Object.entries(validationErrors).length === 0) {
            return next();
        }
        
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: validationErrors });
    };
}