// HINTS:
// 1. Import express and axios
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const API_URL = "https://secrets-api.appbrewery.com/random";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const result = await axios.get(API_URL);
        res.render("index.ejs", { secret:result.data.secret, user:result.data.username });
    } catch (error) {
        console.log(error.message);
        res.render("index.ejs");
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})