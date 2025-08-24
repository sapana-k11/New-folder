import express from 'express'

import { addToCart,removeFromCart,fetchCart } from '../controller/cartController.js'


const cartRouter = express.Router();

cartRouter.post("/add",addToCart);
cartRouter.post("/remove",removeFromCart);
cartRouter.get("/fetch",fetchCart);

export default cartRouter;