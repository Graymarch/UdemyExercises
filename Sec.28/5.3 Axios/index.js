import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Displays a random activity when a users first accesses the page. 
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

//Filters the Bored API based on the user's selections. 
app.post("/", async (req, res) => {
  //Assigns the query params a value if one was selected. 
  let type = (req.body.type.length > 0) ? `type=${req.body.type}` : "type=";
  let participants = (req.body.participants.length > 0) ? `&participants=${req.body.participants}` : "&participants=";
  try {
    const response = await axios.get(`https://bored-api.appbrewery.com/filter?${type+participants}`);
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    //Renders a specific message for a 404 error which indicates that no activities match. 
    res.render("index.ejs", {
      error: ((error.response.status == 404) ? "Your criteria didn't match any activities." : error.message),
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
