import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export const Connection = () => {
  const mongoDB_url = process.env.MONGODB_URL
  if (!mongoDB_url) {
    throw new Error("MongoDB URL is not defined in the environment variables");
  }
  mongoose.set(`strictQuery`, false);
  mongoose.connect(mongoDB_url);
  mongoose.connection.on("connected", () => {
    console.log("Your Database is connected successfully.");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("Your Database is disconnected.");
  });
  mongoose.connection.on("error", () => {
    console.log("Error while connecting the database");
  });
};
