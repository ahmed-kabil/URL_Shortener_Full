const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();


const db_host = process.env.DB_HOST ;
const db_user = process.env.DB_USER ;
const db_pass = process.env.DB_PASS ;
const url = `mongodb://${db_user}:${db_pass}@${db_host}/?authSource=admin`;


const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

// Middlewares
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Routers
const router = require("./router.js");
app.use("/", router);

// Connect to MongoDB
mongoose.connect(url)
  .then(() => {
    console.log("✅ Connected to the DB");
    app.listen(port, () => {
      console.log(`🚀 Server running at http://${host}:${port}`);
    });
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));