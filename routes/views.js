const express = require("express");
const path = require("path");
const { isUserSignedIn, protectedViews } = require("../middleware/routines");
const views = express.Router();

views.get("/",
    (req, res, next) => {
        if (isUserSignedIn(req)) {
            res.redirect("/exercise");
        } else {
            res.sendFile(path.join(__dirname, "../views/index.html"));
        }
    }
);

views.get("/exercise",
    protectedViews,
    (req, res, next) => {
        res.sendFile(path.join(__dirname, "../views/exercise.html"));
    }
)

views.get("/stats",
    protectedViews,
    (req, res, next) => {
        res.sendFile(path.join(__dirname, "../views/stats.html"));
    }
)

views.get("/logout",
    (req, res) => {
        res.clearCookie("token");
        res.redirect("/");
    }
)

module.exports = views;