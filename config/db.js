import mongoose from "mongoose";

export const mongoConnect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/AssignmentDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Connected to Mongo database");
  } catch (e) {
    console.log(`Error connecting to mongo database ${e}`);
  }
};
