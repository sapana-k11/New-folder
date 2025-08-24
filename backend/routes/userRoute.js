//userRoute.js

import express from 'express';
import { recommendedProduct, loginUser,registerUser } from '../controller/userController.js';


const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/recommended",recommendedProduct);

export default userRouter;