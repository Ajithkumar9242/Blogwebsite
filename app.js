const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const _ = require("lodash")
const mongoose = require('mongoose')

let posts = []

const homeDetails = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem fugiat delectus iure totam, odio, tempore ea, aut autem eaque recusandae aliquam nulla tempora laboriosam possimus praesentium repellat quos blanditiis porro voluptatibus."

const aboutContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem fugiat delectus iure totam, odio, tempore ea, aut autem eaque recusandae aliquam nulla tempora laboriosam possimus praesentium repellat quos blanditiis porro voluptatibus."

const contactContent = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem fugiat delectus iure totam, odio, tempore ea, aut autem eaque recusandae aliquam nulla tempora laboriosam possimus praesentium repellat quos blanditiis porro voluptatibus."

const app = express()

app.set("view engine" , "ejs")

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))


mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema = {
  title: {type: String, required: true},
  content: {type: String, required: true}
};

const Post = mongoose.model("Post", postSchema);

app.get("/" , (req, res) => { 
  Post.find({}, function(err, posts){
    res.render("home", {startingContent: homeDetails, posts: posts})
  })
    
})

app.get("/about" , (req, res) => { 
    res.render("about", {about: aboutContent})
})

app.get("/contact" , (req, res) => { 
    res.render("contact", {contact: contactContent})
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
  name: "Admin-ajith",
  password: "Ajith123"
}



app.post('/login' , (req,res) =>{
  if(req.body.name === myDetail.name && req.body.password === myDetail.password){
    res.redirect("/deleteejs")
    console.log("SUCESS");
  }else{
    res.redirect("/")
  }
})



  app.get("/delete", (req,res) =>{
    res.render("login")
    
  })

  app.get("/deleteejs", (req,res) =>{
    Post.find({}, function(err, posts){
    res.render("delete", {startingContent: homeDetails, posts: posts})
    })
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

