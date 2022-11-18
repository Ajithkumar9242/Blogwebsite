require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const _ = require("lodash")
const mongoose = require('mongoose')

let posts = []

const app = express()

app.set("view engine" , "ejs")

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))


// mongoose.connect("mongodb+srv://Ajith:admin-ajith@cluster0.tfeyweo.mongodb.net/blogDB");
mongoose.connect("mongodb://localhost:27017/blogDB")
const postSchema = {
  title: {type: String, required: true},
  content: {type: String, required: true}
};

const Post = mongoose.model("Post", postSchema);

app.get("/" , (req, res) => { 
  Post.find({}, function(err, posts){
    res.render("home", { posts: posts})
  })
    
})

app.get("/about" , (req, res) => { 
    res.render("about")
})


app.get("/contact" , (req, res) => { 
    res.render("contact")
})

app.get("/compose", (req,res) =>{
    res.render("compose")
})

app.post("/compose" , (req,res) =>{
    let post = new Post({
        title: req.body.mytext,
        content: req.body.postBody
    })

    post.save(function(err){
      if (err){
          console.log(err);
      }else{
        res.redirect("/");
      }
    });;
});

app.get("/posts/:postId", (req,res) =>{
 
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
})


const myDetail = {
  name: process.env.NAME,
  password: process.env.PASSWORD
}



app.post('/login' , (req,res) =>{
  if(req.body.name === myDetail.name && req.body.password === myDetail.password){
    Post.find({}, function(err, posts){
      res.render("delete", { posts: posts})
    console.log("SUCESS");

      })
  }else{
    res.redirect("/")
  }
})
  app.get("/delete", (req,res) =>{
    res.render("login") 
  })

app.post("/deletepost" , (req,res) =>{
  const cheecedItems = req.body.chkbox
  
  Post.findByIdAndRemove(cheecedItems, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("SUCCESSFULLY DELETED");
      res.redirect("/")
    }
  })
 })


app.listen(4000, () => {
    console.log("server Started");
})

