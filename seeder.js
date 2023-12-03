const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env
dotenv.config({ path: "./config/config.env" });

// Load model
const Bootcamp = require("./models/Bootcamp");

// Connect to DB
const conn = mongoose.connect(process.env.MONGO_URI, {});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// Import to DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);

    console.log("Data Imported ...".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();

    console.log("Data Destroyed ...".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
