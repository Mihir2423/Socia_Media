import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

export const Connection = () => {
  const mongoDB_url = `mongodb://${USERNAME}:${PASSWORD}@ac-7lkp6wr-shard-00-00.plbgwb7.mongodb.net:27017,ac-7lkp6wr-shard-00-01.plbgwb7.mongodb.net:27017,ac-7lkp6wr-shard-00-02.plbgwb7.mongodb.net:27017/?ssl=true&replicaSet=atlas-j9cjwe-shard-0&authSource=admin&retryWrites=true&w=majority`;
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
