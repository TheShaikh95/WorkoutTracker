const express = require("express");
const usersdb = require("../models/users");
const workoutsdb = require("../models/workouts");
const jwt = require("jsonwebtoken");
const routines = require("../middleware/routines");
const api = express.Router();

api.post("/api/signup",
    routines.checkUserSign(),
    routines.validateSignErrors,
    (req, res, next) => {
        usersdb.create({
            username: req.body.username,
            password: req.body.password
        }).then(result => {
            const token = jwt.sign({ username: result.username }, process.env.JWT_KEY);
            res.cookie("token", token);
            res.cookie("username", result.username).send({ errorList: [], success: true });
        }).catch(err => {
            res.send(JSON.stringify({ errorList: ["Some error occured"] }));
        })
    }
);

api.post("/api/signin",
    routines.checkUserSign(),
    routines.validateSignErrors,
    (req, res, next) => {
        usersdb.find({ 
            username: req.body.username,
            password: req.body.password 
        }, function (err, docs) {
            if (err) res.send(JSON.stringify({ errorList: ["Some error occured"] }));
            if (docs.length) {
                const token = jwt.sign({ username: docs[0].username }, process.env.JWT_KEY);
                res.cookie("token", token);
                res.cookie("username", docs[0].username).send({ errorList: [], success: true });
            } else {
                res.send(JSON.stringify({ errorList: ["User Not exist"] }));
            }
        });
    }
);

api.put("/api/workout/add",
    routines.protectedViews,
    routines.exerciseInputCheck(),
    routines.validateExerciseErrors,
    (req, res, next) => {
        if (req.body.type == "Cardio") {
            req.body.weight = null;
            req.body.sets = null;
            req.body.reps = null;
        } else {
            req.body.distance = null;
        }
        next()
    },
    (req, res) => {
        const user = routines.decodeJWT(req);
        workoutsdb.findOne({ username: user }, (err, result) => {
            if (err) res.send(JSON.stringify({ errorList: ["Some Error Occured."] }));
            if (!result) {
                workoutsdb.create({
                    username: user,
                    workouts: [req.body]
                }).then(response => {
                    res.send({ errorList: [], success: true });
                }).catch(err => {
                    res.send(JSON.stringify({ errorList: ["Some error occured"] }));
                });
            } else {
                workoutsdb.updateOne({ username: user }, {
                    $push: {
                        workouts: [req.body]
                    }
                }, (err, raw) => {
                    if (err) res.send(JSON.stringify({ errorList: ["Some Error Occured."] }));
                    else res.send({ errorList: [], success: true });
                });
            }
        });
    },
);

api.get("/api/workouts/getPrevious", 
    routines.protectedViews,
    (req, res) => {
        workoutsdb.findOne({ username: routines.decodeJWT(req) }, (err, data) => {
            if (err) res.send(JSON.stringify({ errorList: ["Some Error Occured."] }));
            else res.send(JSON.stringify({ data: data, success: true }));
        });
    }
);

api.delete("/api/workouts/delete",
    routines.protectedViews,
    (req, res) => {
        console.log(req.body);
        workoutsdb.updateOne({ username: routines.decodeJWT(req) }, {
            $pull: {
                workouts: { _id: req.body.id }
            }
        }, function(err, raw) {
            if (err) res.send(JSON.stringify({ errorList: ["Some Error Occured."] }));
            else res.send(JSON.stringify({ success: true }));
        });
    }
);

module.exports = api;