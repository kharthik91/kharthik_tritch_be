// ---- DEPENDENCIES ----
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const animalRouter = require('./routers/animal_router')
const userRouter = require("./routers/users_router");

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// ---- MIDDLEWARES ----

// set the Access-Control-Allow-Origin response header value to *
// this will allow the browser CORS policy check to pass so that data can be made available to frontend
app.use(cors({ origin: "*" }));

// handling preflight requests accross the board
app.options("*", cors());

// setting middleware to accept json and urlencoded request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- ROUTES ----

// app.use("/api/v1/itineraries", itinerary_router);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/comments", user_router);

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => {
    app.listen(port, () => {
      console.log(`TRITCH app listening on port: ${port}`);
    });
  });
