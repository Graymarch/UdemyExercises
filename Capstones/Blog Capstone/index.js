import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override"

const app = express();
const port = 3000;

var posts = [];

app.use(bodyParser.urlencoded({ extended: true }));
// When a route sees ?_method in the request it will modify the request's method to the property's value. 
app.use(methodOverride("_method"));
//Parses each requests body. 
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
    //Complete this route to create a new post. 
    posts.push({
        title: req.body.title,
        content: req.body.content,
    });
    res.redirect("/posts");
});

//Put update route
app.put("/update", (req, res) => {
    posts[req.query.postIndex] = {
        title: req.body.title,
        content: req.body.content,
    };
    res.redirect("/posts");
});

app.delete("/delete", (req, res) => {
    posts.splice(req.query.postIndex, 1);
    console.log(posts);
    res.redirect("/posts");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});