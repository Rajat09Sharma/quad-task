const axios = require("axios");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");


const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/quadDB");
const userSchema = new mongoose.Schema({
  name: String,
  baseUnit: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number
});
const User = mongoose.model("user", userSchema);

async function getUser() {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = Object.values(response.data);
    for (var i = 0; i <= 10; i++) {
      const newUser = new User({
        name: data[i].name,
        baseUnit: data[i].base_unit,
        last: data[i].last,
        buy: data[i].buy,
        sell: data[i].sell,
        volume: data[i].volume
      });
      newUser.save();
      console.log(data[i]);
    }
  } catch (error) {
    console.error(error);
  }
}

app.get("/", async (req, res) => {
  try {
    const result = await User.find({});
    if(result) {
      res.render("index",{data:result});
      console.log(result);
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("server started on port 3000.");
})