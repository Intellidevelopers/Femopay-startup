import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import crypto from "crypto";
import dayjs from "dayjs";
import { JWT_SECRET, JWT_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN, NODE_ENV } from "../config/env.js";
import { sendOTPEmail } from "../utils/send-email.js";
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";


// Generate Access Token
export const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } // Example: "15m"
    );
};

// Generate Refresh Token
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN } // Example: "7d"
    );
};

export const signUp = async (req, res) => {
    try {
        const { phone, userName, email, password, role} = req.body;
        const existingUser = await User.findOne({ email });

        // Check if the user exists but has not verified their email
        if (existingUser && !existingUser.isVerified) {
            return res.status(401).json({ message: "User with this Email already exists but not verified. Please verify your email to login." });
        }
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        
        const newUser = new User({ userName, email, password, role, phone });
        await newUser.save();

        // console.log("newUser:", newUser)
        
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiresAt = dayjs().add(10, 'minutes').toDate();
        await OTP.findOneAndUpdate({ email }, { otp, expiresAt: otpExpiresAt }, { upsert: true });

        const type = "user_signup"

       try {
           await sendOTPEmail({ to: email, type, otp, data: newUser });
           console.log("OTP email sent successfully.");
       } catch (emailError) {
           console.error("Error sending OTP email:", emailError);
           return res.status(500).json({ message: "Error sending OTP email", error: emailError.message });
       }
      
        
        res.status(201).json({ message: "User registered. OTP sent to email.", data: newUser });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};




export const onboardUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const { firstName, lastName, tagName } = req.body;
  
      if (!firstName || !lastName || !tagName) {
        return res.status(400).json({ message: "firstName, lastName, and tagName are required" });
      }
  
      // Check if tagName is already taken by another user
      const existingTag = await User.findOne({ tagName, _id: { $ne: userId } });
      if (existingTag) {
        return res.status(409).json({ message: "Tag name is already taken" });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          tagName,
          isOnboarded: true
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        message: "Profile setup complete",
        user: {
          id: updatedUser._id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          tagName: updatedUser.tagName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          isOnboarded: updatedUser.isOnboarded
        }
      });
  
    } catch (error) {
      console.error("Error during onboarding:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  
  



export const setTransactionPin = async (req, res) => {
    try { 
      const { pin, userId } = req.body;
  
      if (!pin || !/^\d{4,6}$/.test(pin)) {
        return res.status(400).json({ message: "PIN must be 4 to 6 digits" });
      }
  
      const hashedPin = await bcrypt.hash(pin, 10);
  
      const user = await User.findByIdAndUpdate(userId, {
        transactionPin: hashedPin,
      });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json({ message: "Transaction PIN set successfully" });
    } catch (error) {
      console.error("Error setting transaction PIN:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };






  export const verifyTransactionPin = async (req, res) => {
    try {
      const { userId } = req.user;
      const { pin } = req.body;
  
      const user = await User.findById(userId).select("+transactionPin");
  
      if (!user || !user.transactionPin) {
        return res.status(400).json({ message: "Transaction PIN not set" });
      }
  
      const isMatch = await bcrypt.compare(pin, user.transactionPin);
  
      if (!isMatch) return res.status(401).json({ message: "Invalid PIN" });
  
      res.status(200).json({ message: "PIN verified" });
    } catch (error) {
      console.error("Error verifying transaction PIN:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  




export const signIn = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if (!password || (!email && !phone)) {
            return res.status(400).json({ message: "Email or phone and password are required" });
        }

        // Find user by email or phone
        const query = email ? { email } : { phone };
        const user = await User.findOne(query);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "Account not verified. Please verify your email to continue." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone,
                isVerified: user.isVerified,
            }
        });

    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ message: "Server error", error });
    }
};



//Refresh Token API
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

        // Verify refresh token
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });

            // Generate a new access token
            const newAccessToken = generateAccessToken({ _id: decoded.userId });

            res.json({ accessToken: newAccessToken });
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


//Logout API
export const signOut = async (req, res) => {
    try {
        // Clear refresh token cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: NODE_ENV,
            sameSite: "strict",
        });

        // Optionally, remove refresh token from the database
        const token = req.cookies.refreshToken;
        if (token) {
            const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
            await User.findByIdAndUpdate(decoded.userId, { refreshToken: null });
        }

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
};


export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp || new Date() > otpRecord.expiresAt) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        await User.findOneAndUpdate({ email }, { isVerified: true });
        await OTP.deleteOne({ email });
        res.json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};





export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiresAt = dayjs().add(10, "minutes").toDate();

        // Update OTP record in the database
        await OTP.findOneAndUpdate(
            { email },
            { otp, expiresAt: otpExpiresAt },
            { upsert: true }
        );

        // Send the new OTP via email
        try {
            await sendOTPEmail({ to: email, type: "resend_otp", otp, data: user });
            res.json({ message: "OTP resent successfully" });
        } catch (emailError) {
            console.error("Error sending OTP email:", emailError);
            return res.status(500).json({ message: "Error sending OTP email", error: emailError.message });
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
