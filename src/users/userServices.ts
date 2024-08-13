import { ProfileModel, ProfileRepository } from "./ProfileRepo";
import { UserModel, UserRepository } from "./UserRepo";
import { AppError } from "../errorHandler/App-error-class";
import { TProfile, TUser } from "../types";

interface IUserServices {
  getUserById(id: string): Promise<TUser | false | never>;
  getAllUsers(): Promise<TUser[] | never>;
  insertProfile(data: TProfile): Promise<TProfile | never>;
}

class UserServices implements IUserServices {
  constructor(
    private readonly UserModel: UserRepository,
    private readonly ProfileModel: ProfileRepository
  ) {
    this.UserModel = UserModel;
    this.ProfileModel = ProfileModel;
  }

  async getProfile(userId: number) {
    const [profile] = (await this.ProfileModel.findOne({
      userId,
    })) as TProfile[];
    if (!profile) throw new AppError("Profile Not Found", 404);
    return profile;
  }

  async insertProfile(data: TProfile) {
    const [profile] = await this.ProfileModel.insert(data);
    if (!profile) throw new AppError("Profile Not Created", 500);
    return profile;
  }

  async updateProfile(userId: number, bio: string) {
    const [profile] = await this.ProfileModel.update({ userId }, { bio });
    if (!profile) throw new AppError("Profile Not Found", 404);
    return profile;
  }

  async getUserById(id: string) {
    const [user] = (await this.UserModel.findOne({
      id: parseInt(id),
    })) as TUser[];
    if (!user) throw new AppError("User Not Found", 404);
    return user;
  }

  async getAllUsers() {
    const users = await this.UserModel.findMany();
    if (!users.length) throw new AppError("Users Not Found", 404);
    return users.map((user: TUser) => ({
      ...user,
      password: undefined,
      passwordResetToken: undefined,
      passwordResetTokenExpires: undefined,
    }));
  }
}

export const UserServicesInstance = new UserServices(UserModel, ProfileModel);
