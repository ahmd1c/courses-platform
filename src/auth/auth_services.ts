import { UserModel, UserRepository } from "../users/UserRepo";
import { TUser } from "../types";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { resetPasswordHtml } from "../utils/mailHtmls";
import { sendMail } from "../utils/sendMail";
import { AppError } from "../errorHandler/App-error-class";

interface IAuthServices {
  registerUser(user: TUser): Promise<TUser | false | never>;
  loginUser(user: Pick<TUser, "email" | "password">): Promise<TUser | false | never>;
}

class AuthServices implements IAuthServices {
  constructor(private readonly UserModel: UserRepository) {
    this.UserModel = UserModel;
  }

  async registerUser(user: TUser) {
    const [isAlreadyRegistered] = (await this.UserModel.findOne({
      email: user.email,
    })) as TUser[];
    if (isAlreadyRegistered) throw new AppError("User Already Registered", 409);
    user.password = await bcrypt.hash(user.password, +process.env.SALT_ROUNDS!);
    const [newUser] = await this.UserModel.insert(user);
    if (!newUser) throw new AppError("User Registration Failed", 500);
    return newUser;
  }

  async loginUser({ email, password }: Pick<TUser, "email" | "password">) {
    const [user] = (await this.UserModel.findOne({ email })) as TUser[];
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new AppError("Invalid Credentials", 400);
    return user;
  }

  async forgotPassword(email: string) {
    const [user] = (await this.UserModel.findOne({ email })) as TUser[];
    if (!user) throw new AppError("User Not Found", 404);
    const passwordResetToken = crypto.randomBytes(32).toString("hex");
    const hashedPasswordResetToken = crypto
      .createHash("sha256")
      .update(passwordResetToken)
      .digest("hex");
    const passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    const updatedUser = await this.UserModel.update(
      {
        id: user.id,
      },
      {
        passwordResetToken: hashedPasswordResetToken,
        passwordResetTokenExpires,
      }
    );
    if (!updatedUser)
      throw new AppError(
        `Email Not Sent ${process.env.dev ? "DB UPDATE ERROR" : ""}`,
        500
      );

    try {
      const URL = `${process.env.CLIENT_URL}/reset-password?token=${passwordResetToken}`;
      await sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: "Reset Password",
        html: resetPasswordHtml(URL),
      });
    } catch (err) {
      throw new AppError(`Email Not Sent ${process.env.dev ? err : ""} `, 500);
    }
  }

  async resetPassword(passwordResetToken: string, newPassword: string) {
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const [user] = await this.UserModel.findByResetToken(passwordResetToken);
    if (!user) throw new AppError("Invalid Token", 400);
    const hashedNewPassword = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS!);
    const [updatedUser] = await this.UserModel.update(
      {
        id: user.id,
      },
      {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
        passwordResetToken: null,
        passwordResetTokenExpires: null,
      }
    );
    if (!updatedUser) throw new AppError("Password Reset Failed", 500);
  }

  async updatePassword(userId: number, oldPassword: string, newPassword: string) {
    const [user] = (await this.UserModel.findOne({ id: userId })) as TUser[];
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw new AppError("Invalid Credentials", 400);
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS!);
    const [updatedUser] = await this.UserModel.update(
      {
        id: user.id,
      },
      {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
      }
    );
    if (!updatedUser) throw new AppError("Password Update Failed", 500);
    return updatedUser;
  }
}

export const AuthServicesInstance = new AuthServices(UserModel);
