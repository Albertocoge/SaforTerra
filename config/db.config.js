
const mongoose = require("mongoose");

const DB_NAME = 'farm2fork'
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const CONNECTION_URI = `${MONGO_URI}/${DB_NAME}`
mongoose
  .connect(CONNECTION_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });