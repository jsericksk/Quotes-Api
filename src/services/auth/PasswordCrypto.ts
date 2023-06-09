import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

async function hashPassword(password: string) {
    const saltGenerated = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, saltGenerated);
}

async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}

export const PasswordCrypto = {
    hashPassword,
    verifyPassword,
};