import express from "express";
import bodyParser from "body-parser";
import pool from "./db.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [];

try {
  let response = await pool.query("SELECT * FROM users");
  users = response.rows;
} catch (error) {
  console.error("Query Failed: " + error);
}

async function checkVisisted(user_id) {
  const result = await pool.query(
    `SELECT country_code 
    FROM user_visits 
    INNER JOIN countries c ON country_id = c.id
    INNER JOIN users u ON user_id = u.id
    WHERE user_id = $1`, 
    [user_id]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(countries);
  
  return countries;
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted(users.find(user => user.id == currentUserId).id);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: users.find(user => user.id == currentUserId).color,
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await pool.query(
      `SELECT id FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';`,
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const country_id = data.id;
    try {
      await pool.query(
        "INSERT INTO user_visits VALUES ($1, $2)",
        [currentUserId, country_id]
      );
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

app.post("/user", async (req, res) => {
  if(req.body.add){
    res.render("new.ejs");
  }else{
    let user_id

    if(req.body.user){
      user_id = req.body.user;
      currentUserId = user_id;
    }

    const countries = await checkVisisted(user_id);
    console.log(countries);
    
    
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: users.find(user => user.id == user_id).color,
    });
  }
});

app.post("/new", async (req, res) => {
  let name = req.body.name;
  let color = req.body.color;

  try {
    let response = await pool.query(
      `INSERT INTO users (name, color) 
      VALUES ($1, $2)
      RETURNING *;`, 
      [name, color]
    );    

    users.push(response.rows[0]);
    currentUserId = users[users.length-1].id;
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
