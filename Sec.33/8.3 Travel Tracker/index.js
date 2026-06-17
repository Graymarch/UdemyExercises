import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({path: "./.env"});
let env = process.env;

const app = express();
const port = 3000;
const db = new pg.Client({
  user: env.USER,
  host: env.HOST,
  database: env.DATABASE,
  password: env.PASSWORD,
  port: env.PORT
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
