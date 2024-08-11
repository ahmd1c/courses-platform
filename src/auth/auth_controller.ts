/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthServicesInstance } from "./auth_services";
import asynHandler from "../utils/asyncHandler";
import createTokenAndCookie from "../utils/createToken";

export const registerUserController = asynHandler(async (req, res, next) => {
  const { email, password, name } = req.body;
  const newUser = await AuthServicesInstance.registerUser({
    email,
    password,
    name,
  });
  const { id, name: username, email: userEmail, role } = newUser;
  createTokenAndCookie(newUser.id, res);
  res.status(201).json({
    message: "User Created Successfully",
    user: {
      id,
      name: username,
      email: userEmail,
      role,
    },
  });
});

export const loginUserController = asynHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await AuthServicesInstance.loginUser({ email, password });
  const { password: userPass, ...safeUser } = user;
  createTokenAndCookie(user.id, res);
  res
    .status(200)
    .json({ message: "User Logged In Successfully", user: safeUser });
});

export const logOutUserController = asynHandler(async (req, res, next) => {
  res.cookie("token", "", { httpOnly: true, maxAge: 0 });
  res.status(200).json({ message: "User Logged Out Successfully" });
});

export const forgotPasswordController = asynHandler(async (req, res, next) => {
  const { email } = req.body;
  await AuthServicesInstance.forgotPassword(email);
  res.status(200).json({ message: "Password Reset Link Sent To Your Email" });
});

export const resetPasswordController = asynHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;
  await AuthServicesInstance.resetPassword(token, newPassword);
  res.status(200).json({ message: "Password Reset Successfully" });
});

export const updatePasswordController = asynHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await AuthServicesInstance.updatePassword(
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    req.user?.id!,
    oldPassword,
    newPassword
  );
  createTokenAndCookie(user.id, res);
  res.status(200).json({ message: "Password Updated Successfully" });
});
