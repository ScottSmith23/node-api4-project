const express = require('express');

const Users = require('./userDb.js');
const Posts = require("../posts/postDb.js");

const router = express.Router();

router.post('/',validateUser, (req, res) => {
  Users.insert(req.body)
  .then(users => {
    res.status(200).json(users);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error adding the user',
    });
  });
});

router.post('/:id/posts',validateUserId,validatePost, (req, res) => {
  const data = { ...req.body, user_id: req.params.id };
  Posts.insert(data)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log("Error adding new post.", err);
      res.status(500).json({ message: "Error adding post" });
    });
});

router.get('/', (req, res) => {
  Users.get(req.query)
  .then(users => {
    res.status(200).json(users);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the users',
    });
  });
});

router.get('/:id',validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(users => {
    res.status(200).json(users);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the user',
    });
  });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(posts => {
    if (posts.length !== 0) {
    res.status(200).json(posts);
    } else {
      res.status(400).json({
        message: "No posts made by this user"
      });
    }
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the user posts',
    });
  });
});


router.delete('/:id',validateUserId, (req, res) => {
  Users.remove(req.params.id)
  .then(user => {
    if (user.length == 0) {
      res.status(404).json({
        message: "No user Found"
      });
    } else {
      res.status(200).json({
        message: "User deleted"
      });
    }
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error removing the user',
    });
  });
});

router.put('/:id',validateUserId, (req, res) => {
  const changes = req.body;
  Users.update(req.params.id,changes)
  .then(() => {
    if (!changes.name) {
      res.status(400).json({ errorMessage: "Please provide user name." });
    } else {
      res.status(200).json({ message: `info updated.` });
    }
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error updating the user',
    });
  });
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  Users.getById(id).then(user => {
    if (user) {
      req.user = user;
    } else {
      res.status(400).json({ message: "invalid user ID." });
    }
  });
  next();
}

function validateUser(req, res, next) {
  const userData = req.body;
  if (Object.keys(userData).length === 0) {
    res.status(400).json({ message: "No data" });
  }
  if (!userData.name) {
    res.status(400).json({ message: "No name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const postData = { ...req.body, user_id: req.params.id };
  if (Object.keys(postData).length === 0) {
    res.status(400).json({ message: "No data" });
  }
  if (!postData.text) {
    res.status(400).json({ message: "No text" });
  } else {
    next();
  }
}

module.exports = router;
