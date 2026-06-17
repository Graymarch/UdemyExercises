//Node import statements
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

//Configuration settings. 

 //Configures the environment file. 
dotenv.config({path: "./.env"});
let env = process.env;

//Setup for the Express app. 
const app = express();
const port = 3000;

//Setup for the Postgres API. 
const db = new pg.Client({
  user: env.USER,
  host: env.HOST,
  database: env.DATABASE,
  password: env.PASSWORD,
  port: env.PORT
});

//Middleware for the express app. 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Connects to the Postgres database.
db.connect();

//Attempts to query the database for all visited countries' codes. 
let visited;
try {
  visited = await db.query("SELECT country_code FROM visited_countries");
} catch (error) {
  console.error("Query Failed: " + error.message);
}

//Closes the connection to the database. 
db.end();

//Index route. 
app.get("/", async (req, res) => {
  //Concatenates the country codes into a comma delineated string. 
  let codes = "";
  visited.rows.forEach(country => {
    codes += country.country_code + ",";
  });

  res.render("index.ejs", {
    countries: codes,
    total: visited.rows.length
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
