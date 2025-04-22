import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/user.model.js";

import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js'





export const getUsers = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, role, search, sortBy = "createdAt", order = "desc" } = req.query;
  
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const sortOrder = order === "asc" ? 1 : -1;
  
      let filter = {};
  
      if (role) filter.role = role;
      if (search) {
        filter.$or = [
          { userName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }
  
      const totalUsers = await User.countDocuments(filter);
  
      const users = await User.find(filter)
        .select("-password")
        .sort({ [sortBy]: sortOrder })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
  
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        currentPage: pageNumber,
        totalPages: Math.ceil(totalUsers / limitNumber),
        totalUsers,
        results: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };



  
export const getUserById = async (req, res, next) => {
    try {
    
      const { id } = req.params;
  
      const user = await User.findById(id).select("-password")
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };



export const getCurrentlyLoggedInUserBySession = async (req, res, next) => {
    try {
      // console.log("user::", req.user);
      const id  = req.user?._id;
  
      const user = await User.findById(id).select("-password");
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };




  

export const deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  
  
