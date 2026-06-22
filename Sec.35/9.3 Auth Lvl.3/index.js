//Package import statements
import express from "express";
import bodyParser from "body-parser";
import pool from "./db.js"
import bcrypt from "bcrypt";

//App configuration
const app = express();
const port = 3000;
const saltRounds = 10; //How many times the password should be salted and hashed. 

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
  
    //Checks if the email has already registered. 
    if(checkUser.rows.length > 0) {
      res.send("This email has already been registered. Try logging in.");
    } else {
      //Hashes the password with bcrypt and saves it in postgres. 
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if(err){
          console.error("Registration Failed: " + err);
        }else{
          const result = await pool.query(
            `INSERT INTO users (email, password)
            VALUES ($1, $2)`, 
            [email, hash]
          );
          
          res.render("secrets.ejs");
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
});

//Attempts to login the user. 
app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;

  //Pulls the email and hashed password from postgres. 
  try {
    const result = await pool.query(
      `SELECT email, password
      FROM users
      WHERE email = $1`, 
      [email]
    );
  
    if(result.rows.length == 0){
      res.send("Login failed. Double check your inputs and try again.");
    }else{
      const user = result.rows[0];
      const storedPassword = user.password;

      //Bcrypt compares the hash of the submitted password to the storedPassword. 
      bcrypt.compare(loginPassword, storedPassword, (err, result) => {
        if(err){
          console.error("Login Failed: " + err);
        }else if(result){
          res.render("secrets.ejs");
        }else{
          res.send("Login failed. Double check your inputs and try again.");
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
});

//Starts the app listening.
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
