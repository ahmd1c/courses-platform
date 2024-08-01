import { AppError } from "../errorHandler/App-error-class";
import { WhishlistRepository, WhishlistModel } from "./WhishlistRepo";

class WhishlistServices {
  constructor(private readonly WhishlistModel: WhishlistRepository) {
    this.WhishlistModel = WhishlistModel;
  }

  async getWhishlist(userId: number) {
    const whishlist = await this.WhishlistModel.findMany({
      filter: { userId },
    });
    if (!whishlist.length) throw new AppError("Whishlist Not Found", 404);
    return whishlist;
  }

  async insertOne(userId: number, courseId: number) {
    const [newWhishlistItem] = await this.WhishlistModel.insert({
      userId,
      courseId,
    });
    if (!newWhishlistItem) throw new AppError("Item Not added to Whishlist", 500);
    return newWhishlistItem;
  }

  async deleteOne(userId: number, courseId: number) {
    const [deletedWhishlistItem] = await this.WhishlistModel.delete({
      userId,
      courseId,
    });
    if (!deletedWhishlistItem) throw new AppError("Item Not found in Whishlist", 404);
    return deletedWhishlistItem;
  }
  async clearWhishList(userId: number) {
    const [isCleared] = await this.WhishlistModel.delete({
      userId,
    });
    if (!isCleared) throw new AppError("Whishlist Not found", 404);
    return isCleared;
  }
}

export const WhishlistServicesInstance = new WhishlistServices(WhishlistModel);
