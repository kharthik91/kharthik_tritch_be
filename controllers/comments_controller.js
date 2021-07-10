const express = require('express')
const router = express.Router()
const mongoose = require("mongoose"); 
const { CommentsModel } = require('../models/comments_model')

module.exports= {

// Get all comments
index: (req, res) => {
    CommentsModel.find({}, (err, data) => {
        if(!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    });
},

// Get one comment

show: (req, res) => {
    CommentsModel.findById(req.params.id, (err, data) => {
        if(!err) {
            res.send(data);
        } else {
           console.log(err);
        }
    });
},

// create comment
create: async (req, res) => {
    let cmt = null
    try {
     cmt = await CommentsModel.create({
        comments: req.body.comments,
    
    }); 
    } catch (err) {
        console.log(err);
        return res.json()
    }
    console.log(req.body)
    res.statusCode = 200
    return res.json()

},


// update comment

update: (req, res) => {


    const cmt = {
        comments: req.body.comments,
    };
    CommentsModel.findByIdAndUpdate(req.params.id, { $set: cmt }, { new: true }, (err, data) => {
        if(!err) {
            res.status(200).json({code: 200, message: 'comment updated', updateComment: data})
        } else {
            console.log(err);
        }
    });
},


// Delete comment
delete: (req, res) => {

    CommentsModel.findByIdAndRemove(req.params.id, (err, data) => {
        if(!err) {
            // res.send(data);
            res.status(200).json({code: 200, message: 'comment deleted', deleteComment: data})
        } else {
            console.log(err);
        }
    });
},


}