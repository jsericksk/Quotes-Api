import { Request, Response } from "express";
import { QuotesService } from "../../services/quotes/QuotesService";
import { BodyProps, GetAllQueryProps } from "./QuotesRequestValidation";
import { StatusCodes } from "http-status-codes";
import { simpleError } from "../../errors/simpleError";
import { QUOTE_NOT_FOUND } from "../../commom/Constants";
import { QuoteRoute } from "../../commom/RouteConstants";

export class QuotesController {

    constructor(private quotesService: QuotesService) { }

    getAll = async (req: Request, res: Response): Promise<Response> => {
        const queryProps = req.query as GetAllQueryProps;
        const page = Number(queryProps.page) || 1;
        const filter = queryProps.filter || "";
        const limit = 15;

        const result = await this.quotesService.getAll(page, limit, filter);
        const count = await this.quotesService.count(queryProps.filter);

        if (result instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(result.message));
        } else if (count instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(count.message));
        }

        res.setHeader("access-control-expose-headers", "x-total-count");
        res.setHeader("x-total-count", count);

        const totalCount = count;
        const totalPages = Math.ceil(totalCount / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;

        if (page > totalPages) {
            return res.status(StatusCodes.NOT_FOUND).json(simpleError("Invalid page, no more items"));
        }

        const getPage = (page: number): string => {
            if (filter === "") {
                return `${QuoteRoute.getAll}?page=${page}`;
            }
            return `${QuoteRoute.getAll}?page=${page}&filter=${filter}`;
        };

        const info = {
            count: totalCount,
            pages: totalPages,
            next: nextPage ? getPage(nextPage) : null,
            previous: previousPage ? getPage(previousPage) : null,
        };
        const response = {
            info,
            results: result,
        };

        return res.status(StatusCodes.OK).json(response);
    };

    getById = async (req: Request, res: Response): Promise<Response> => {
        const quote = await this.quotesService.getById(Number(req.params.id));
        if (quote instanceof Error) {
            if (quote.message === QUOTE_NOT_FOUND) {
                return res.status(StatusCodes.NOT_FOUND).json(simpleError(quote.message));
            }
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
        const quote = await this.quotesService.create(bodyProps);
        if (quote instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(quote.message));
        }
        return res.status(StatusCodes.CREATED).json(quote);
    };

    updateById = async (req: Request, res: Response): Promise<Response> => {
        const updatedQuote = req.body as BodyProps;
        const result = await this.quotesService.updateById(Number(req.params.id), updatedQuote);
        if (result instanceof Error) {
            if (result.message === QUOTE_NOT_FOUND) {
                return res.status(StatusCodes.NOT_FOUND).json(simpleError(result.message));
            }
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(result.message));
        }
        return res.status(StatusCodes.NO_CONTENT).json(result);
    };

    deleteById = async (req: Request, res: Response): Promise<Response> => {
        const result = await this.quotesService.deleteById(Number(req.params.id));
        if (result instanceof Error) {
            if (result.message === QUOTE_NOT_FOUND) {
                return res.status(StatusCodes.NOT_FOUND).json(simpleError(result.message));
            }
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(simpleError(result.message));
        }
        return res.status(StatusCodes.NO_CONTENT).json(result);
    };
}