import { z } from "zod";
import { zodValidation } from "../../middlewares/zodValidation";
import { User } from "../../models/User";
import { RefreshToken } from "../../models/RefreshToken";
import { AuthInputConstraint } from "../../commom/InputConstraints";

export class UserAuthRequestValidation {

    validateRegister = zodValidation((customSchema) => ({
        body: customSchema<Omit<User, "id">>(
            z.object({
                email: z.string().email().min(AuthInputConstraint.email.min).max(AuthInputConstraint.email.max),
                username: z.string().min(AuthInputConstraint.username.min).max(AuthInputConstraint.username.max),
                password: z.string().min(AuthInputConstraint.password.min),
            })
        ),
    }));

    validateLogin = zodValidation((customSchema) => ({
        body: customSchema<Omit<User, "id" | "username">>(
            z.object({
                email: z.string().email().min(AuthInputConstraint.email.min).max(AuthInputConstraint.email.max),
                password: z.string().min(AuthInputConstraint.password.min),
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