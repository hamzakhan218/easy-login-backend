import mongoose from "mongoose";

const connectDB = async () => {
  console.log(process.env.MONGO_URI);
  try {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
      })
      .then((conn) =>
        console.log(`MongoDB Connected: ${conn.connection.host}`)
      );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
