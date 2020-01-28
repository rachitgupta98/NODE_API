const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userCredSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  collegeName: {
    type: String
  }
});

const userCredModel = mongoose.model("userCredentials", userCredSchema);

module.exports = { userCredModel };
