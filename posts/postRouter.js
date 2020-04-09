const express = require('express');

const Posts = require('./postDb.js')

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get(req.query)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the posts',
    });
  });
});

router.get('/:id',validatePostId, (req, res) => {
  Posts.getById(req.params.id)
  .then(post => {
    res.status(200).json(post);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the post',
    });
  });
});

router.delete('/:id',validatePostId, (req, res) =>  {
  Posts.remove(req.params.id)
  .then(post => {
    if (post.length == 0) {
      res.status(500).json({
        message: "No Post Found"
      });
    } else {
      res.status(200).json({
        message: "Post deleted"
      });
    }
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error removing the post',
    });
  });
});

router.put('/:id',validatePostId, (req, res) =>  {
  const changes = req.body;
  Posts.update(req.params.id,changes)
  .then(() => {
    if (!changes.text) {
      res.status(400).json({ errorMessage: "Text field can't be empty" });
    } else {
      res.status(200).json({ message: `post updated.` });
    }
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error updating the post',
    });
  });
})

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id;
  Posts.getById(id).then(post => {
    if (post) {
      req.post = post;
    } else {
      res.status(400).json({ message: "invalid post ID." });
    }
  });
  next();
}

module.exports = router;
