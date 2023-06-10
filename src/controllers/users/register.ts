import { Request, Response } from "express";
import { User } from "../../models/User";
import { UserService } from "../../services/users/UserService";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { zodValidation } from "../../middlewares/zodValidation";
import { simpleError } from "../../errors/simpleError";

interface BodyProps extends Omit<User, "id"> { }

export const registerValidation = zodValidation((customSchema) => ({
    body: customSchema<BodyProps>(
        z.object({
            email: z.string().email().min(6),
            username: z.string().min(3),
            password: z.string().min(6),
        })
    ),
}));

export async function register(req: Request<{}, {}, BodyProps>, res: Response) {
    const user = await UserService.registerUser(req.body);

    if (user instanceof Error) {
        return res.status(500).json(simpleError(user.message));
    }

    return res.status(StatusCodes.CREATED).json(user);
}