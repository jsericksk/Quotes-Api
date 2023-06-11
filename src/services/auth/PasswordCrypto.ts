import bcrypt from "bcryptjs";

export class PasswordCrypto {
    private SALT_ROUNDS = 10;

    async hashPassword(password: string) {
        const saltGenerated = await bcrypt.genSalt(this.SALT_ROUNDS);
        return await bcrypt.hash(password, saltGenerated);
    }

    async verifyPassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    }
}