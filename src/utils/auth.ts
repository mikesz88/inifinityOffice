import { Response } from 'express';
import { jwtInfoSchema } from '../zod/auth.types';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoByte = require('crypto');

interface Options {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
  sameSite?: boolean | 'lax' | 'none' | 'strict';
}

// to be used for password and forgot password answer
export const saltValue = async (value: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(value, salt);
};

// Sign JWT and return
// changed from id to email bc it is unique
export const getSignedJwt = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

// to be used for password and forgot password comparison
export const matchSaltedValue = async (value: string, saltedValue: string) => {
  return await bcrypt.compare(value, saltedValue);
};

// also returning reset password token and expiration.
export const getResetPasswordToken = () => {
  const resetToken = cryptoByte.randomBytes(20).toString('hex');

  const resetPasswordToken = cryptoByte
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // const resetPasswordExpired = Date.now() + 10 * 60 * 1000;

  return { resetPasswordToken, resetToken };
};

export const sendTokenResponse = (
  id: string,
  statusCode: number,
  res: Response
) => {
  const token = getSignedJwt(id);

  const options: Options = {
    expires: new Date(
      Date.now() +
        +(process.env.JWT_COOKIE_EXPIRE as string) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: false,
  };

  if ((process.env.NODE_ENV = 'production')) {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

export const getDataFromAuthToken = (token?: string) => {
  if (!token) return null;

  try {
    return jwtInfoSchema.parse(jwt.verify(token, process.env.JWT_SECRET));
  } catch (e) {
    return null;
  }
};
