import crypto from 'crypto';
import { nanoid } from "nanoid";

import { db } from '@/lib/db';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
    const token = nanoid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id },
        });
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
    const token = nanoid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return verificationToken;
};