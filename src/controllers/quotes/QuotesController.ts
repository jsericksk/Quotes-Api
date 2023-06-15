import { Request, Response } from "express";
import { QuotesService } from "../../services/quotes/QuotesService";
import { BodyProps, GetAllQueryProps } from "./QuotesRequestValidation";
import { StatusCodes } from "http-status-codes";
import { simpleError } from "../../errors/simpleError";

export class QuotesController {

    constructor(private quotesService: QuotesService) { }

    getAll = async (req: Request, res: Response): Promise<Response> => {
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

    getById = async (req: Request, res: Response): Promise<Response> => {
        const quote = this.quotesService.getById(Number(req.params.id));
        if (quote instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(quote.message));
        }
        return res.status(StatusCodes.OK).json(quote);
    };

    create = async (req: Request, res: Response): Promise<Response> => {
        const authenticatedUserInfo = {
            id: Number(req.headers.userId),
            username: req.headers.username as string,
            email: req.headers.email as string
        };
        const bodyProps = req.body as BodyProps;
        bodyProps.postedByUserId = authenticatedUserInfo.id;
        bodyProps.postedByUsername = authenticatedUserInfo.username;
        const quote = this.quotesService.create(bodyProps);
        if (quote instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(quote.message));
        }
        return res.status(StatusCodes.OK).json(quote);
    };

    updateById = async (req: Request, res: Response): Promise<Response> => {
        const updatedQuote = req.body as BodyProps;
        const result = this.quotesService.updateById(Number(req.params.id), updatedQuote);
        if (result instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(result.message));
        }
        return res.status(StatusCodes.NO_CONTENT).json(result);
    };

    deleteById = async (req: Request, res: Response): Promise<Response> => {
        const result = this.quotesService.deleteById(Number(req.params.id));
        if (result instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(result.message));
        }
        return res.status(StatusCodes.NO_CONTENT).json(result);
    };
}