import { z } from "zod";
import { zodValidation } from "../../middlewares/zodValidation";
import { User } from "../../models/User";

export class UserAuthReqValidation {

    validateRegisterRequest = zodValidation((customSchema) => ({
        body: customSchema<Omit<User, "id">>(
            z.object({
                email: z.string().email().min(6),
                username: z.string().min(3),
                password: z.string().min(6),
            })
        ),
    }));

    validateLoginRequest = zodValidation((customSchema) => ({
        body: customSchema<Omit<User, "id" | "username">>(
            z.object({
                email: z.string().email().min(6),
                password: z.string().min(6),
            })
        ),
    }));
}