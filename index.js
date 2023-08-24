import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
import db from "./config/Db_Config.js";
import MyWorkRoute from './routes/MyWorkRoute.js';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

(async () => {
  console.log("database connected");
  await db.sync();
})();

app.use(cors({ credentials: true, origin: '*' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
// app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   }),
// );
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(MyWorkRoute)

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));