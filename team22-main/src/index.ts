import path = require("path");
import { AppDataSource } from "./data-source";
import express from "express";
import router from "./routes/routes";
import SocketController from "./controller/socketController"

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "public")));


app.use("/", router);

AppDataSource.initialize()
    .then(() => {
        console.log(`Data Source has been initialized! http://localhost:${PORT}`)
        const socketController = new SocketController()
        app.listen(PORT, () => {
            console.log("YEY")
        });
        
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    });