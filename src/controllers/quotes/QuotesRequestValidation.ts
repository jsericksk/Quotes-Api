import { z } from "zod";
import { zodValidation } from "../../middlewares/zodValidation";
import { Quote } from "../../models/Quote";
import { QuoteInputConstraint } from "../../commom/InputConstraints";

export interface BodyProps extends Omit<Quote, "id"> { }

export interface ParamsProps { id: number }

export interface GetAllQueryProps {
    page?: number;
    filter?: string;
}

export class QuotesRequestValidation {

    validateGetAll = zodValidation((customSchema) => ({
        query: customSchema<GetAllQueryProps>(
            z.object({
                page: z.coerce.number().int().min(1).optional(),
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
                quote: z.string().min(QuoteInputConstraint.quote.min).max(QuoteInputConstraint.quote.max),
                author: z.string().min(QuoteInputConstraint.author.min).max(QuoteInputConstraint.author.max),
            })
        )
    }));

    validateUpdateById = zodValidation((customSchema) => ({
        body: customSchema<BodyProps>(
            z.object({
                quote: z.string().min(QuoteInputConstraint.quote.min).max(QuoteInputConstraint.quote.max),
                author: z.string().min(QuoteInputConstraint.author.min).max(QuoteInputConstraint.author.max),
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