import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    let dayType = new Date("May 30, 2026").getDay() <=4 ? "a weekday" : "the weekend";

    res.render("index.ejs", {
        dayType: dayType,
        advice: "time to work hard!",
    });
});

app.listen(port, () => {
    console.log("App is listening.");
});
