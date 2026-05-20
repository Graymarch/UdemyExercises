import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>");
})

app.get("/contact", (req, res) => {
    res.send("<p>123-456-7890</p>");
})

app.get("/about", (req, res) => {
    res.send("<p>I am a Towson Graduate</p>");
})

app.listen(port, () => {
    console.log(`Server is listening to port ${port}.`);
})