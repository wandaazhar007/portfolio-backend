import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import FileUpload from "express-fileupload";
// import bodyParser from "body-parser";
import db from "./config/Db_Config.js";
import MyWorkRoute from './routes/MyWorkRoute.js';
import MyBlogRoute from './routes/MyBlogRoute.js';
import CategoryRoute from './routes/CategoryRoute.js';

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
app.use(FileUpload());
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
app.use(MyWorkRoute);
app.use(MyBlogRoute);
app.use(CategoryRoute);

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));