import { z } from "zod";
import { zodValidation } from "../../middlewares/zodValidation";
import { User } from "../../models/User";
import { RefreshToken } from "../../models/RefreshToken";

export class UserAuthRequestValidation {

    validateRegister = zodValidation((customSchema) => ({
        body: customSchema<Omit<User, "id">>(
            z.object({
                email: z.string().email().min(6).max(270),
                username: z.string().min(3).max(50),
                password: z.string().min(6),
            })
        ),
    }));

    validateLogin = zodValidation((customSchema) => ({
        body: customSchema<Omit<User, "id" | "username">>(
            z.object({
                email: z.string().email().min(6).max(270),
                password: z.string().min(6),
            })
        ),
    }));

    validateRefreshToken = zodValidation((customSchema) => ({
        body: customSchema<Omit<RefreshToken, "id" | "userId">>(
            z.object({
                refreshToken: z.string(),
            })
        ),
    }));
}