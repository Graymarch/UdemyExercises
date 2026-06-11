import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import e from "express";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

const yourBearerToken = "a9e72738-6934-41fc-a6e8-3eab09f05565";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    console.log(config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.message) });
  }
});

app.post("/post-secret", async (req, res) => {
  try {
    const result = await axios.post(API_URL + "/secrets", req.body, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { content: JSON.stringify(error.message) });
  }
});

app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.put(API_URL + `/secrets/${searchId}`, req.body, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { content: JSON.stringify(error.message) });
  }
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.patch(API_URL + `/secrets/${searchId}`, req.body, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { content: JSON.stringify(error.message) });
  }
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.delete(API_URL + `/secrets/${searchId}`,config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { content: JSON.stringify(error.message) });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
