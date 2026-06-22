//Package import statements
import express from "express";
import bodyParser from "body-parser";
import pool from "./db.js"

//App configuration
const app = express();
const port = 3000;

//Middleware configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Index route. 
app.get("/", (req, res) => {
  res.render("home.ejs");
});

//Renders the login page. 
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

//Renders the registration page. 
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

//Attempts to register a user. 
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  
  //Checks if the email has already been registered. If it has, an error is sent. 
  //Otherwise, the app attempts to register the user. 
  try {
    const checkUser = await pool.query(`
      SELECT *
      FROM users
      WHERE email = $1`,
      [email]
    );
  
    if(checkUser.rows.length > 0) {
      res.send("This email has already been registered. Try logging in.");
    } else {
      const result = await pool.query(
        `INSERT INTO users (email, password)
        VALUES ($1, $2)`, 
        [email, password]
      );
    
      res.render("secrets.ejs");
    }
  } catch (err) {
    console.error(err);
  }
});

//Attempts to login the user. 
app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const result = await pool.query(
      `SELECT email, password
      FROM users
      WHERE email = $1 AND password = $2`, 
      [email, password]
    );
  
    if(result.rows.length == 0){
      res.send("Login failed. Double check your inputs and try again.");
    }else{
      res.render("secrets.ejs");
    }
  } catch (err) {
    console.error(err);
  }
});

//Starts the app listening.
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
