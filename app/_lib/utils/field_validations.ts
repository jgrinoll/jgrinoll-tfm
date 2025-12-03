import LoginUserDTO from "../models/LoginUserDTO";
import RegisterUserDTO from "../models/RegisterUserDTO";

export const validateEmail = (email: string) =>
  !!email &&
  /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/.test(email) &&
  email.length <= 100;

export const validateUsername = (username: string) =>
  !!username && username.length <= 50;

export const validatePassword = (password: string) =>
  !!password && password.length <= 30 && password.length > 8;

export const validateRegisterFields = (user: RegisterUserDTO): boolean => {
  return (
    validateEmail(user.email) &&
    validateUsername(user.username) &&
    validatePassword(user.plainPassword)
  );
};
export const validateLoginFields = (user: LoginUserDTO): boolean => {
  return validateEmail(user.email) && validatePassword(user.plainPassword);
};
