const express = require('express');
const router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* Set up mongoose in order to connect to mongo database */
const mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://0.0.0.0:27017/commentDB'); //Connects to a mongo database called "commentDB"

const commentSchema = mongoose.Schema({ //Defines the Schema for this database
    Name: String,
    Comment: String
});

const Comment = mongoose.model('Comment', commentSchema); //Makes an object from that schema as a model

const db = mongoose.connection; // Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});

/* GET comments from database */
router.get('/comment', function(req, res, next) {
    console.log("In the GET route");

    Comment.find(function(err,commentList) { //Calls the find() method on your database
        if (err) return console.error(err); //If there's an error, print it out
        else {
            console.log(commentList); //Otherwise console log the comments you found

            res.json(commentList);
        }
    });
});

/* Post a comment to the database */
router.post('/comment', function(req, res, next) {
    console.log("POST comment route"); //[1]

    let newcomment = new Comment(req.body); //[3]
    console.log(newcomment); //[3]

    newcomment.save(function(err, post) { //[4]
        if (err) return console.error(err);
        console.log(post);
        res.sendStatus(200);
    });
});


router.delete('/comment', function (req, res) {
    console.log('DELETE comment route');
    Comment.deleteMany({ $or: [{Name: { $ne: ''}}, {Name: {$eq: ''}}] }, function (err) {
        console.log('Deleted comments.');
    });
    res.sendStatus(200);
});

module.exports = router;
