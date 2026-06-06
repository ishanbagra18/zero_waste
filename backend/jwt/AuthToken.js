import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

const createTokenAndSaveCookies = async ({ userId, res }) => {
  // Fetch user details
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Include full user info in the token payload
  const token = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      organisation: user.organisation,
      location: user.location,
      role: user.role,
    },
    process.env.JWT_TOKEN,
    {
      expiresIn: '7d',
    }
  );

  // Save cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Optional: Store token in DB (not always necessary)
  await User.findByIdAndUpdate(userId, { token });

  return token;
};

export default createTokenAndSaveCookies;
