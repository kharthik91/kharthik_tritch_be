const express = require('express')
const mongoose = require("mongoose"); 
const { CommentsModel } = require('../models/comments_model')
const router = express.Router()
const {commentsValidator} = require('../validations/comments_validation');

module.exports= {

index: (req, res) => {
        CommentsModel.find({itinerary_id:req.params.itinerary_id})
        //.populate('email')
        .then((response) => {
            if (!response) {
                res.statusCode = 404;
                return res.json();
            }
    
            return res.json(response);
        })
        .catch((err) => {
            console.log(err);
            res.statusCode = 500;
            return res.json(err);
        });
        },

show: (req, res) => {
    CommentsModel.find({user_id:req.params.user_id})
    .populate('user')
    .then((response) => {
        if (!response) {
            res.statusCode = 404;
            return res.json();
        }

        return res.json(response);
    })
    .catch((err) => {
        console.log(err);
        res.statusCode = 500;
        return res.json(err);
    });
    },

// create comment
create: async (req, res) => {

    // //validation
    const commentsValidatorResult = commentsValidator.validate(req.body);
    if (commentsValidatorResult.error) {
        res.statusCode = 400;
        return res.json(commentsValidatorResult.error);
    }

    let cmt = null
    try {
     cmt = await CommentsModel.create({
        comments: req.body.comments,
        itinerary_id: req.params.itinerary_id,
        user_id: req.params.user_id,
        user: req.params.user_id
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

    //    //validation
       const commentsValidatorResult = commentsValidator.validate(req.body);
       if (commentsValidatorResult.error) {
           res.statusCode = 400;
           return res.json(commentsValidatorResult.error);
       }
   

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

    CommentsModel.findByIdAndRemove(req.params.id)
    .then((response) => {
        if (!response) {
            res.statusCode = 404;
            return res.json();
        }

        return res.json(response);
    })
    .catch((err) => {
        console.log(err);
        res.statusCode = 500;
        return res.json(err);
    });
    },
    

}




