const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load ENV
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();

// Route files
const bootcamps = require("./routes/bootcamps");

const app = express();

//body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

// error handler miidleware
app.use(errorHandler);

const PORT = process.env.PORT || 4100;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handele unhandeled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & close
  server.close(() => process.exit(1));
});
