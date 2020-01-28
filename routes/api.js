const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const withAuth = require("./auth");
const userModel = require("../model/schema");
const jwt = require("jsonwebtoken");
const secretkey = "secret";

router.get("/api/editForm", withAuth);

//registering user
router.post("/api/signup", (req, res, next) => {
  const { body } = req;
  const { username, password } = body;

  userModel.userCredModel
    .find({ username: username })
    .exec()
    .then(user => {
      if (user.length > 0) {
        res.json({
          message: "username exists"
        });
      } else {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
              res.sendStatus(500).json({
                error: "Error"
              });
            } else {
              userModel.userCredModel.create(
                {
                  username: username,
                  password: hash
                },
                (err, user) => {
                  if (err) {
                    res.json({
                      message: "There is a problem in registering user",
                      err
                    });
                  } else {
                    res.json({
                      message: "Successfully created new user"
                    });
                  }
                }
              );
            }
          });
        });
      }
    });
});

//login user
router.post("/api/login", (req, res) => {
  const { body } = req;
  const { username, password } = body;
  userModel.userCredModel.findOne({ username: username }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again"
      });
    } else if (!user) {
      res.status(401).json({
        error: "incorrect mail and password"
      });
    } else {
      bcrypt.compare(password, user.password, function(err, result) {
        if (err) {
          return res.status(401).json({
            error: "Unauthorized Access"
          });
        }
        if (result) {
          console.log("jwt");
          const users = {
            username: user.username
          };
          const token = jwt.sign({ users }, secretkey, { expiresIn: "1000s" });

          res.status(200).send({ auth: true, token: token });
        }
      });
    }
  });
});

//add colleg name
router.post("/api/addCollege", withAuth, (req, res) => {
  const { body } = req;
  const { name, collegeName, username } = body;
  if (!collegeName) {
    res.status(400).send({ message: "CollegeName need to be filled" });
  } else {
    userModel.userCredModel.findOneAndUpdate(
      { username: username },
      {
        name: name,
        collegeName: collegeName
      },
      {
        useFindAndModify: false
      },
      (err, user) => {
        if (err) {
          res.status(401).json({
            message: "There is a problem in adding user details"
          });
        } else {
          res
            .status(200)
            .json({
              message: "Successfully added user with name and collegeName"
            })
            .send(user);
        }
      }
    );
  }
});

//update Collegname
router.put("/api/editCollege", withAuth, (req, res) => {
  const { body } = req;
  const { collegeName, username } = body;
  if (!collegeName) {
    res.status(400).send({ message: "Enter College Name" });
  } else {
    userModel.userCredModel
      .findOneAndUpdate(
        { username: username },
        {
          collegeName: collegeName
        },
        {
          useFindAndModify: false,
          new: true
        }
      )
      .then(data => {
        if (!data) {
          res.status(401).json({
            message: "College name not found by name " + req.params.name
          });
        }
        res.send(data);
      })
      .catch(err => {
        res.status(500).json({
          message: "Error updating college name with name " + req.params.name
        });
      });
  }
});
module.exports = router;
