import { Request, Response } from "express";
import { QuotesService } from "../../services/quotes/QuotesService";
import { GetAllQueryProps } from "./QuotesRequestValidation";
import { StatusCodes } from "http-status-codes";


export class QuotesController {

    constructor(private quotesService: QuotesService) { }

    getAll = async (req: Request, res: Response) => {
        const queryProps = req.query as GetAllQueryProps;
        const result = await this.quotesService.getAll(
            queryProps.page || 1,
            queryProps.limit || 7,
            queryProps.filter || "",
            Number(queryProps.id || 1)
        );
        const count = await this.quotesService.count(queryProps.filter);

        if (result instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: { default: result.message }
            });
        } else if (count instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: { default: count.message }
            });
        }

        res.setHeader("access-control-expose-headers", "x-total-count");
        res.setHeader("x-total-count", count);

        return res.status(StatusCodes.OK).json(result);
    };

}