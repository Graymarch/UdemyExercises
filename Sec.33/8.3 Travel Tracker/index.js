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
  console.log(codes);
  //Renders the index.
  res.render("index.ejs", {
    countries: codes,
    total: visited.rows.length,
    error: (req.query.err) ? req.query.err : null,
  });
});

//Add a visited country route
app.post("/add", async (req, res) => {
  let country = req.body.country;
  let result;
  let code;
  let err;

  //Attempts to find the right country code based on the string submitted. 
  try {
    result = await pool.query("SELECT country_code FROM countries WHERE LOWER($1) = LOWER(country_name)", [country]);
  } catch (error) {
    console.error("Query Failed: " + error.message);
  }

  //Checks to make sure a code was found before attempting to insert it into the visited_countries table.
  //Then, redirects to the index page. 
  if(result.rowCount > 0){
    code = result.rows[0].country_code;
    try {
      await pool.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [code]);
    } catch (error) {
      console.error("Query Failed: " + error.message);
      err = `You have already visited ${country}.`;
    }
  }else{
    console.error("Query returned no results.");
    err = country + " does not match any country in our database. Try again.";
  }

  //Passes an error as a query parameter if an error has occurred. 
  if(err){
    res.redirect(`/?err=${err}`);
  }else{
    res.redirect("/");
  }
});

//Starts the app listening.
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
