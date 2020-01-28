const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

//setup mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://<username></username>:<password>@api-cluster-jziuo.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(
    () => {
      console.log("Database connection established!");
    },
    err => {
      console.log("Error connecting Database instance due to: ", err);
    }
  );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("./routes/api"));
//setup server
app.listen(PORT, function() {
  console.log("server running");
});
