//import * as fs from "fs";
import express from "express";
import bodyParser from "bodyParser";
import dbConfig from "./services/dbConfig";
import webServerConfig from "./config/webServerConfig";
import mssql from "mssql";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/sqlserver/JDEVTAS/getByYM", (req, res) => {
  res.send("Hello there");
});

app.listen("10100", () => {
  console.log("Server Alive");
});
