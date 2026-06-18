//Node import statements
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import pool from "./db.js";

//Setup for the Express app. 
const app = express();
const port = 3000;

//Middleware for the express app. 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Index route. 
app.get("/", async (req, res) => {

  //Queries postgres for visisted countries.
  let visited;
  try {
    visited = await pool.query("SELECT country_code FROM visited_countries");
  } catch (error) {
    console.error("Query Failed: " + error.message);
  }

  //Pushes the country codes into an array. 
  let codes = [];
  visited.rows.forEach(country => {
    codes.push(country.country_code);
  });

  //Renders the index.
  res.render("index.ejs", {
    countries: codes,
    total: visited.rows.length
  });
});

//Starts the app listening.
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
