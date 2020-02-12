//

// const router = require('express').Router();
const express = require('express')

const router = express.Router()

module.exports = router;

const db = require('../data/db.js')

router.post('/', (req, res) => {
    const postInfo = req.body;
    console.log(postInfo)
    if(!postInfo.title || !postInfo.contents) {
        console.log(postInfo.title)
        res.status(400).json({errorMessage: "Please provide a title and content for the post."})
    } else {
        db.insert(postInfo)
            .then( data => res.status(201).json(data))
            .catch(err => res.status(500).json({ error: "There was an error while saving the post to the database" }))
    }


})

router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    const comment = req.body;
    
    db.findById(id)
        .then(post => {
           
            if(post.length) {
                
                if(comment.text){
                    db.insertComment(comment)
                        .then(updatedComment => res.status(201).json(updatedComment))
                        .catch(err => res.status(500).json({errorMessage : "There was an error while saving the comment to the database"}))
                } else {
                    res.status(404).json({errorMessage: "Please specify comment."})
                }
            } else {
                res.status(404).json({ errorMessage: "id doesn't exist" })
            }
        })
        .catch(err => res.status(500).json({ errorMessage: "There was an error while saving the comment to the database"}))
    })

    

router.get('/',(req, res) => {
    db.find()
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(500).json({error: "The posts information could not be retrieved."}))

})

router.get('/:id',(req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(post => {
            if(!post.length) {
                res.status(404).json({message: "The post with the specified ID does not exist."})
            } else {
                res.status(500).json(post);
            }
        })
        .catch(err => res.status(500).json({ message: "Unable to retrive the post at this point." }))
})

router.get('/:id/comments',(req, res) => {
        const id=req.params.id
        db.findPostComments(id)
        .then(comment => {
            if(!comment.length) {
                res.status(404).json({message: "The comment for the specified post ID does not exist."})
            } else {
                res.status(500).json(comment);
            }
        })
        .catch(err => res.status(500).json({ message: "Unable to retrieve the comments at this point" }))
})

router.delete('/:id', (req, res) => {

    const id = req.params.id

    db.findById(id)
        .then( post => {
            console.log(!post)
            if(!post.length) {
                
                res.status(404).json({message : "The post with the specified ID does not exist."})
            } else {
                return post
        }
        })
        .then( post =>{ 
                    console.log(post[0].id)
                    db.remove(post[0].id)
                        .then(deletedPost=> res.status(200).json(deletedPost))
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ errorMessage: "The post could not be removed" })
                    })
                })
        .catch(err => {
            console.log(err)
            res.status(500).json({errorMessage: 'Sorry, unable to delete'})
        })


})

router.put('/:id',(req, res) => {
    const id = req.params.id;
    const data = req.body;
    db.findById(id)
        .then( post => {
            if(!post.length) {
                console.log(post)
                res.status(404).json({message : "The post with the specified ID does not exist."})
            } else {
                return post
        }
        })
        .then( post =>{ 
                    db.update(post[0].id,data)
                        .then(updatedpost => res.status(200).json(updatedpost))
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({ errorMessage: "The post could not be updated" })
                    })
                })
        .catch(err => {
            console.log(err)
            res.status(500).json({errorMessage: 'Sorry, unable to update at this point'})
        })

})

