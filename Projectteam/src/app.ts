import express from "express";
import path from "path";

import { router } from "./routes/routes";
import { AppDataSource } from "./data-source";
import SocketController from "./controller/socketController";

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized");
    new SocketController();
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.error("DB connection error:", err));