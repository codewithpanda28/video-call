import exprss from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getmyFriends,
  getOutgoingFriendRequests,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js";
const router = exprss.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getmyFriends);

router.post("/friend-request:id", sendFriendRequest);
router.put("/friend-request:id/accept", acceptFriendRequest);

router.get("/friend-request", getFriendRequests);
router.get("/outgoing-friend-request", getOutgoingFriendRequests);

export default router;
