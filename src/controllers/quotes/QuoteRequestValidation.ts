import { z } from "zod";
import { zodValidation } from "../../middlewares/zodValidation";
import { Quote } from "../../models/Quote";

export interface BodyProps extends Omit<Quote, "id" | "publicationDate"> { }

export interface ParamsProps { id: number }

interface GetAllQueryProps {
    id?: number;
    page?: number;
    limit?: number;
    filter?: string;
}

export class QuoteRequestValidation {

    validateGetAll = zodValidation((customSchema) => ({
        query: customSchema<GetAllQueryProps>(
            z.object({
                id: z.coerce.number().int().min(1).optional().default(0),
                page: z.coerce.number().int().min(1).optional(),
                limit: z.coerce.number().int().min(1).optional(),
                filter: z.coerce.string().optional(),
            })
        )
    }));

    validateGetById = zodValidation((customSchema) => ({
        params: customSchema<ParamsProps>(
            z.object({
                id: z.coerce.number().int().min(1),
            })
        )
    }));

    validateCreate = zodValidation((customSchema) => ({
        body: customSchema<BodyProps>(
            z.object({
                quote: z.string().min(7),
                author: z.string(),
                postedBy: z.string(),
            })
        )
    }));

    validateUpdateById = zodValidation((customSchema) => ({
        body: customSchema<BodyProps>(
            z.object({
                quote: z.string().min(7),
                author: z.string(),
                postedBy: z.string()
            })
        ),
        params: customSchema<ParamsProps>(
            z.object({
                id: z.coerce.number().int().min(1),
            })
        )
    }));

    validateDeleteById = zodValidation((customSchema) => ({
        params: customSchema<ParamsProps>(
            z.object({
                id: z.coerce.number().int().min(1),
            })
        )
    }));
}