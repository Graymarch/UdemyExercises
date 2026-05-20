//Imports 'express' method from the 'express' module. 
import express from "express";

//Initializes an app using the 'express' method. 
const app = express();
const port = 3000;

//The app listens for traffic on port 3000
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}.`)
})