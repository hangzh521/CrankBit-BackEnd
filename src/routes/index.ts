import express from "express";
import userRouter from "./user";
import authRouter from "./auth";
import authenticateUser from "../middleware/auth";

const v1Router = express.Router();

v1Router.use("/auth", authRouter);
v1Router.use("/users", authenticateUser, userRouter);

export default v1Router;
