import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", (req, res) => {
    let pswd = req.body.password;
    if(pswd == "ILoveProgramming"){
        res.sendFile(__dirname + "/public/secret.html");
    }else{
        res.redirect("/")
    }
})

app.listen(port, () => {
    console.log(`Server is listening to port ${port}`);
})