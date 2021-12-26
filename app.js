import express from "express";
import { mongoConnect } from "./config/db";
import UserRoute from "./routes/userRoute";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
mongoConnect();
app.use(cors());
app.use("/userapi", UserRoute());
app.get("/", (req, res) => {
  res.send({
    code: 200,
  });
});
app.listen(process.env.PORT || 5000, () => {
  console.log(`Listning ${process.env.PORT}`);
});
