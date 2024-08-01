import { Router } from "express";
import { authUser } from "../utils/authentication";
import { addToWhishlist, clearWhishList, getWhishList } from "./whishlist_controller";

const router = Router();

// use inside users router

router.get("/wishlist", authUser, getWhishList);
router.post("/wishlist", authUser, addToWhishlist);
router.delete("/wishlist", authUser, clearWhishList);
router.delete("/wishlist/:courseId", authUser);

export default router;
