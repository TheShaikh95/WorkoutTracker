const mongoose = require("mongoose");

const workouts = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    workouts: [
        {
            type: { type: String },
            name: { type: String },
            weight: { type: Number },
            reps: { type: Number },
            sets: { type: Number },
            time: { type: Number },
            distance: { type: Number },
            date: { type: Date }
        }
    ]
});

module.exports = mongoose.model('workouts', workouts);