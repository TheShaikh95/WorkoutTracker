const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const routines = {
    checkUserSign: function() {
        return [
            check('username').notEmpty().withMessage("username cannot be empty.").isAlphanumeric().withMessage("username should contain only letters and numbers.").trim().escape(),
            check('password').notEmpty().withMessage("password cannot be empty.").isLength({min: 5}).withMessage("password length should be more than 5 characters").trim().escape(),
        ]
    },
    validateSignErrors: function(req, res, next) {
        const errors = validationResult(req).errors;
        if (errors.length) {
            let errorList = [];
            errors.forEach(element => {
                errorList.push(element.msg);
            });
            res.send({ errorList });
        } else {
            next();
        }
    },
    isUserSignedIn: function(req) {
        return jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    },
    protectedViews: function(req, res, next) {
        jwt.verify(req.cookies.token, process.env.JWT_KEY, (err) => {
            if (err) {
                res.redirect("/");
            } else {
                next();
            }
        });
    },
    exerciseInputCheck: function() {
        return [
            check('type').notEmpty().withMessage("workout type cannot be empty.").trim().escape(),
            check('name').notEmpty().withMessage("exercise name cannot be empty.").trim().escape(),
            check('time').notEmpty().withMessage("time cannot be empty.").isInt({ min: 0 }).withMessage("time cannot be negative.").trim().escape(),
            check('date').notEmpty().withMessage("date cannot be empty.").trim().escape(),
            check('reps').notEmpty().withMessage("reps cannot be empty.").isInt({ min: 0 }).withMessage("reps cannot be negative.").trim().escape(),
            check('sets').notEmpty().withMessage("sets cannot be empty.").isInt({ min: 0 }).withMessage("sets cannot be negative.").trim().escape(),
            check('weight').notEmpty().withMessage("weight cannot be empty.").isInt({ min: 0 }).withMessage("weight cannot be negative.").trim().escape(),
            check('distance').notEmpty().withMessage("distance cannot be empty.").isInt({ min: 0 }).withMessage("distance cannot be negative.").trim().escape(),
        ];
    },
    validateExerciseErrors: function (req, res, next) {
        let errors = validationResult(req).errors;
        for (let index = 0; index < errors.length; index++) {
            let element = errors[index];
            if (element.param == "distance" && req.body.type != "Cardio") {
                errors.splice(index, 1);
                index--
            } else if ((element.param == "weight" || element.param == "sets" || element.param == "reps") && req.body.type == "Cardio") {
                errors.splice(index, 1);
                index--;
            }
        }
        if (errors.length) {
            let errorList = [];
            errors.forEach(element => {
                errorList.push(element.msg);
            });
            res.send(JSON.stringify({ errorList }));
        } else {
            next();
        }
    },
    decodeJWT: function(req) {
        return jwt.decode(req.cookies.token).username;
    }
}
module.exports = routines;