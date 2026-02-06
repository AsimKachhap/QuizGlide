import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const mongoInstance = await mongoose.connect(
      process.env.MONGO_CONNECTION_URI,
    );
    console.log(
      "SUCCESSFULLY connected to MONGODB. Host : ",
      mongoInstance.connection.host,
    );
  } catch (error) {
    console.log("FAILED TO CONNECT MONGODB.");
    process.exit(1);
  }
};
