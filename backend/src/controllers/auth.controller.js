import { upsertStreamUser } from "../lib/stream.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({
        "message": "Please provide all required fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        "message": "Password must be at least 6 characters long",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        "message": "Please provide a valid email address",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        "message": "User with this email already exists",
      });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const user = await User.create({
      email,
      password,
      fullName,
      profilePicture: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.fullName,
        image: user.profilePicture || "",
      });
      console.log(`Stream user upserted successfully for ${user.fullName}`);
    } catch (error) {
      console.log(`Error upserting Stream user for ${user.fullName}:`, error);
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      "message": "User created successfully",
      "user": user,
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({
      "message": "Internal server error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        "message": "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        "message": "Invalid email or password",
      });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        "message": "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      "success": true,
      "message": "Login successful",
      "user": user,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({
      "message": "Internal server error",
    });
  }
}

export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({
    "success": true,
    "message": "Logout successful",
  });
}

export async function onboard(req, res) {
  
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        "message": "Please provide all required fields",
        missingFields: [
         !fullName && "fullName",
         !bio && "bio",
         !nativeLanguage && "nativeLanguage",
         !learningLanguage && "learningLanguage",
         !location && "location"
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
     ...req.body,
      isOnboarded: true,
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        "message": "User not found",
      });
    }

    res.status(200).json({
      "message": "User onboarded successfully",
      "user": updatedUser,
    })

    try {
       await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePicture || "",
    })
    console.log(`Stream user upserted successfully for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log(`Error upserting Stream user for ${updatedUser.fullName}:`, streamError.message);
      
    }
   

  } catch (error) {
    console.log("Error in onboard controller:", error);
    res.status(500).json({
      "message": "Internal server error",
    });
  }
}

