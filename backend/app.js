const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();


const db_host = process.env.DB_HOST ;
// const db_user = process.env.DB_USER ;
// const db_pass = process.env.DB_PASS ;
// const url = `mongodb://url-mongodb-sfs-0.url-mongodb-headless-srv:27017,url-mongodb-sfs-1.url-mongodb-headless-srv:27017,url-mongodb-sfs-2.url-mongodb-headless-srv:27017/?replicaSet=rs0&readPreference=secondaryPreferred`;


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
mongoose.connect(db_host)
  .then(() => {
    console.log("✅ Connected to the DB");
    app.listen(port, () => {
      console.log(`🚀 Server running at https://${host}`);
    });
  })
  .catch((err) => console.error("❌ DB Connection Error:", err));