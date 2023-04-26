const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));



main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
    }

const articleSchema = new mongoose.Schema({
    title: String,      
    content: String
    });

const Article = mongoose.model("Article", articleSchema);



/////////////////////////////Request Targeting All Articles ////////////////////

app.route("/articles")

.get(function(req, res){
    Article.find().then(function(result){
        res.send(result)
    }).catch(function(err){
        console.log(err);
    });
    
})

// This part is conected to postman
.post(async (req, res) => {
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save().then(success => {
        res.send("Succesfully added a new article");
    }).catch(err => {
        res.send(err);
    })
})

.delete(async function(req ,res){
    await Article.deleteMany({}).then(function (){    
    res.send("successfully deleted all articles");    
    }) .catch(err =>{    
    res.send(err);
    
    });
    
    });


// app.post("articles", function(req, res){
//     console.log(req.body.title);
//     console.log(req.body.content);
// });

///////////////////Request Targeting A Specific Articles ////////

app.route("/articles/:articleTitle")

// This also works fine
// .get(async function (req, res) {
//   try {
//    const foundArticle = await Article.findOne({ title: req.params.articleTitle });
//         if (foundArticle) {
//             res.send(foundArticle);
//         } else {
//             res.send('No articles matching that title was found.');
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({
//             message: "Something went wrong",
//         });
//     }
// });

.get(async function(req, res){
    await Article.findOne({title: req.params.articleTitle})
    .then(function(result){
        if(result){
        res.send(result)
    } else {
        res.send("Not Found")
    }
    })
    .catch(function(err){
        res.send(err);
    })
})

.put(async function(req, res){
    await Article.replaceOne(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        {overwrite: true}
        )
        .then(function(result){
            if(result){
        res.send(`Successfully updated the article!`);
    } else {
        res.send("Update not successful")
    }
        })
        .catch(function(err) {
        res.send(err);
        });
    })

    .patch(async function(req, res){
        await Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            )
            .then(function(result){
                if(result){
            res.send(`Successfully updated the article!`);
        } else {
            res.send("Update not successful")
        }
            })
            .catch(function(err) {
            res.send(err);
            });
        })

    .delete(async function(req, res){
        await Article.deleteOne(
            {title: req.params.articleTitle},
            )
            .then(function(result){
                if(result){
            res.send(`Successfully deleted`);
        } else {
            res.send(err)
        }
            })
            .catch(function(err) {
            res.send(err);
            });
        });



app.listen(3000, function() {
    console.log("Server started on port 3000");
});