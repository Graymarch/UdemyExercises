//import statements for required node modules
import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override"

//Initializes the express app and the port we'll use. 
const app = express();
const port = 3000;

//Contains the posts in a simple array. Later expand into proper storage. 
var posts = [];

//Parses each requests body.
app.use(bodyParser.urlencoded({ extended: true }));
// When a route sees ?_method in the request it will modify the request's method to the property's value. 
app.use(methodOverride("_method"));
//Configures the express app to use the 'public' folder for static resources such as styling. 
app.use(express.static("public"));

//Landing page route
app.get("/", (req, res) => {
    res.render("index.ejs");
});

//Editor page route
app.get("/editor", (req, res) => {
    //Checks if an existing post's id was passed in and modifies the editor's
    //form action accordingly. 
    var action = "";
    //sets 'postIndex' to the submitted param if available, otherwise it is -1. 
    var postIndex = req.query.postIndex || -1;
    if(postIndex != -1){
        action = `/update?_method=PUT&postIndex=${postIndex}`
    }else{
        action = "/create"
    }
    res.render("editor.ejs", {
        action: action,
        postIndex: postIndex,
        posts: posts,
    });
});

//Page to view all posts. 
app.get("/posts", (req, res) => {
    res.render("posts.ejs", {
        posts: posts,
    });
});

//New post submission route
app.post("/create", (req, res) => {
    posts.push({
        title: req.body.title,
        content: req.body.content,
        date: req.body.date,
    });
    res.redirect("/posts");
});

//Put update route
app.put("/update", (req, res) => {
    //The post's index is passed back to express and that element of 'posts' is replaced. 
    posts[req.query.postIndex] = {
        title: req.body.title,
        content: req.body.content,
        date: req.body.date,
    };
    res.redirect("/posts");
});

//Post deletion route. 
app.delete("/delete", (req, res) => {
    posts.splice(req.body.postIndex, 1);
    res.redirect("/posts");
});

//Starts the express app listening. 
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});