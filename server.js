require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter.js");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//route setup
app.use("/auth", authRouter);

//DB setup
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Error connecting to mongodb", err));

//server setup
const port = process.env.PORT || 7010;
app.listen(port, () => console.log(`Server running at port ${port}`));
