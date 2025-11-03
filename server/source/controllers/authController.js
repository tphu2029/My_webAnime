import bcrypt from "bcrypt";
import User from "../models/User.js";
import Session from "../models/Session.js";
import e from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14day

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // check username is unique
    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res.status(409).json({ message: "Username already exists." });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    //return
    return res.sendStatus(204);
  } catch (error) {
    console.error("singUp error", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const signIn = async (req, res) => {
  try {
    // get input
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // get hashed password from db
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // compare password
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    //create access token with JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // create refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // create session for refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expireAt: new Date(Date.now() + REFRESH_TOKEN_TTL), // 14 days
    });
    // return refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // return access token
    return res.status(200).json({ massage: "Sign in successful", accessToken });
  } catch (error) {
    console.error("signIn error", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const signOut = async (req, res) => {
  try {
    // get refresh token from cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // delete session from session
      await Session.findOneAndDelete({ refreshToken: token });

      // delete cookie
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("signOut error", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
