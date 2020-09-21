const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3000;
const app = express();

if ("development" == app.get('env')) {
  require("dotenv").config();
  app.use(require("morgan")("dev"));
}

app.use(cookieParser());

app.use(express.json());

app.use(express.static("public"));

// connecting to mongodb atlas
mongoose.connect(`mongodb+srv://afnantheadmin:${process.env.DB_PASSWORD}@cluster0.ztv1h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require("./routes/api"));
app.use(require("./routes/views.js"));


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});