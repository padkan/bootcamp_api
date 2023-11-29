const express = require("express");
const dotenv = require("dotenv");

// Load ENV
//dotenv.config({ path: "./config/config.env" });

const app = express();

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NOD_ENV} mode on port {PORT}`);
});
