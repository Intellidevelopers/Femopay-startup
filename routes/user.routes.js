import { Router } from "express";
import { deleteUser, getCurrentlyLoggedInUserBySession, getUserById, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();


userRouter.get('/get-all', authorize, getUsers);


userRouter.get('/get-one/:id', authorize, getUserById);

userRouter.get('/get-auth-user', authorize, getCurrentlyLoggedInUserBySession);


userRouter.delete('/delete/:id', authorize, deleteUser);



export default userRouter;