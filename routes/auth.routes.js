import { Router } from "express";
import { forgotPassword, onboardUser, refreshToken, resendOTP, resetPassword, setTransactionPin, signIn, signOut, signUp, verifyOTP, verifyTransactionPin } from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";



const authRouter = Router();

authRouter.post('/sign-up', signUp);

authRouter.put('/onboard/:userId', onboardUser);

authRouter.post('/sign-in', signIn);

authRouter.post('/set-pin', setTransactionPin);

authRouter.post('/verify-pin',authorize, verifyTransactionPin);

authRouter.post('/refresh-token', refreshToken);

authRouter.post('/verify-otp', verifyOTP);

authRouter.post('/resend-otp', resendOTP);

authRouter.post('/send-reset-otp', forgotPassword);

authRouter.post('/reset-password', resetPassword);

authRouter.post('/sign-out', signOut);


export default authRouter;