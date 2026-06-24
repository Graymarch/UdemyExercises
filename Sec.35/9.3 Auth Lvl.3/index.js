//Package import statements
import express from "express";
import bodyParser from "body-parser";
import pool from "./db.js"
import bcrypt from "bcrypt";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2"

//App configuration
const app = express();
const port = 3000;
const saltRounds = 10; //How many times the password should be salted and hashed. 
dotenv.config({path: "./.env"});
const env = process.env;

//Middleware configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

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

app.get("/secrets", (req, res) => {
  if(req.isAuthenticated()){
    res.render("secrets.ejs");
  }else{
    res.redirect("/login");
  }
});

app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/secrets", passport.authenticate("google", {
  successRedirect: "/secrets",
  failureRedirect: "/login"
}));

app.get("/logout", (req, res) => {
  req.logout(err => {
    if(err) console.error(err);
    res.redirect("/");
  });
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

//Attempts to login the user with the local Passport Strategy.  
/*
-> The 'local' argument identifies which strategy to use. In this case it uses the local strategy defined below. 

-> successRedirect identifies where to go if authentication is successful. 

-> failureRedirect identifies where to go if authentication is unsuccessful. 
*/
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login"
  }
));

//Defines the local passport strategy. In effect just took all the authentication logic which was originally in "/login" post route. 
/*
-> The username and password params automatically find the credentials that are posted to the login page, assuming the names
are the same. 

-> The cb param is a callback defined by Passport: (error: any, user?: false | Express.User | undefined, options?: IVerifyOptions) => void
The error param is nullable and accepts String values and Error values. The user param is meant for objects representing users but can
be set to false if no user is applicable. 
*/
passport.use("local", new Strategy(async function verify (username, password, cb) {
    //Pulls the email and hashed password from postgres. 
    try {
      const result = await pool.query(
        `SELECT email, password
        FROM users
        WHERE email = $1`, 
        [username]
      );
    
      if(result.rows.length == 0){
        return cb("User not found");
      }else{
        const user = result.rows[0];
        const storedPassword = user.password;

        //Bcrypt compares the hash of the submitted password to the storedPassword. 
        bcrypt.compare(password, storedPassword, (err, result) => {
          if(err){
            cb(err);
            console.error("Login Failed: " + err);
          }else if(result){
            return cb(null, user); //Authenticates the user. 
          }else{
            return cb(null, false);
          }
        });
      }
    } catch (err) {
      return cb(err);
    }
  })
);

passport.use("google", new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://googleapis.com/oauth2/v3/userinfo"
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    try {
      const result = await pool.query(
        `SELECT *
        FROM users
        WHERE email = $1`,
        [profile.email]
      );

      if(result.rows.length == 0){
        const newUser = await pool.query(
          `INSERT INTO users (email, password)
          VALUES ($1, $2)`,
          [profile.email, "google"]
        );

        cb(null, newUser.rows[0]);
      }else{
        //User already exists
        cb(null, result.rows[0]);
      }
    } catch (error) {
      console.error(error);
      cb(error);
    }
  
  }
));

//Abstract methods provided by Passport to store and retrieve the user data locally. 
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

//Starts the app listening.
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
