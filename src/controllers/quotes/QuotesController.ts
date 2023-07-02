import { Request, Response } from "express";
import { QuotesService } from "../../services/quotes/QuotesService";
import { BodyProps, GetAllQueryProps } from "./QuotesRequestValidation";
import { StatusCodes } from "http-status-codes";
import { simpleError } from "../../errors/simpleError";
import { QuoteRoute } from "../../commom/RouteConstants";
import { Quote } from "../../models/Quote";
import { CustomError, ErrorCode } from "../../errors/CustomError";

export class QuotesController {

    constructor(private quotesService: QuotesService) { }

    getAll = async (req: Request, res: Response): Promise<Response> => {
        const queryProps = req.query as GetAllQueryProps;
        const page = Number(queryProps.page) || 1;
        const filter = queryProps.filter || "";
        const limit = 15;

        const result = await this.quotesService.getAll(page, limit, filter);
        const count = await this.quotesService.count(queryProps.filter);

        if (result instanceof CustomError) {
            return res.status(result.statusCode).json(simpleError(result.message));
        } else if (count instanceof CustomError) {
            return res.status(count.statusCode).json(simpleError(count.message, count.errorCode));
        }

        res.setHeader("access-control-expose-headers", "x-total-count");
        res.setHeader("x-total-count", count);

        const totalCount = count;
        const totalPages = Math.ceil(totalCount / limit);
        const nextPage = page < totalPages ? page + 1 : null;
        const previousPage = page > 1 ? page - 1 : null;

        if (page > totalPages) {
            return res.status(StatusCodes.NOT_FOUND).json(simpleError("Invalid page, no more items", ErrorCode.INVALID_PAGE));
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
        if (quote instanceof CustomError) {
            return res.status(quote.statusCode).json(simpleError(quote.message));
        }
        return res.status(StatusCodes.OK).json(quote);
    };

    create = async (req: Request, res: Response): Promise<Response> => {
        const authenticatedUserInfo = {
            id: Number(req.headers.userId),
            username: req.headers.username as string,
            email: req.headers.email as string
        };
        const { quote, author } = req.body;
        const quoteToCreate: Omit<Quote, "id"> = {
            quote: quote,
            author: author,
            postedByUserId: authenticatedUserInfo.id,
            postedByUsername: authenticatedUserInfo.username
        };

        const createdQuote = await this.quotesService.create(quoteToCreate);
        if (createdQuote instanceof CustomError) {
            return res.status(createdQuote.statusCode).json(simpleError(createdQuote.message));
        }
        return res.status(StatusCodes.CREATED).json(createdQuote);
    };

    updateById = async (req: Request, res: Response): Promise<Response> => {
        const quoteId = Number(req.params.id);
        const loggedInUserId = Number(req.headers.userId);
        const updatedQuote = req.body as BodyProps;
        const result = await this.quotesService.updateById(quoteId, loggedInUserId, updatedQuote);

        if (result instanceof CustomError) {
            return res.status(result.statusCode).json(simpleError(result.message));
        }
        return res.status(StatusCodes.NO_CONTENT).json(result);
    };

    deleteById = async (req: Request, res: Response): Promise<Response> => {
        const quoteId = Number(req.params.id);
        const loggedInUserId = Number(req.headers.userId);
        const result = await this.quotesService.deleteById(quoteId, loggedInUserId);

        if (result instanceof CustomError) {
            return res.status(result.statusCode).json(simpleError(result.message));
        }
        return res.status(StatusCodes.NO_CONTENT).json(result);
    };
}