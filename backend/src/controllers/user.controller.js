import FriendRequest from "../models/FriendRequest.js";
import { User } from "../models/User.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude current user
        { _id: { $nin: currentUser.friends } }, // Exclude friends of current user
        { isOnboarded: true }, // Only include users who have completed onboarding
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommendedUsers controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getmyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage "
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getmyFriends controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    //prevent sending req to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send a request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Check if the recipient is already a friend
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user." });
    }

    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Friend request already exists." });
    }

    const friendRequest = new FriendRequest({
      sender: myId,
      recipient: recipientId,
    });

    // Save the friend request to the database
    await friendRequest.save();

    res.status(201).json({ message: "Friend request sent successfully." });
  } catch (error) {
    console.log("Error in sendFriendRequest controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    //verify the currect user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request" });
    }

    // Add the sender to the recipient's friends list
    friendRequest.status = "accepted";
    await friendRequest.save();

    //add each user to the other friend's array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic ");

    res.status(200).json({ incomingRequests, acceptedRequests });


  } catch (error) {
    console.log("Error in getFriendRequests controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendRequests controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}