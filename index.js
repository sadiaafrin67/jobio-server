// require("dotenv").config();
const express = require("express");

const port = process.env.PORT || 5000;

const app = express();
const cors = require("cors");

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}

// middleware
app.use(cors(corsOptions));
app.use(express.json());



app.get("/", (req, res) => {
  res.send("JobIO Server is running"); 
});

app.listen(port, () => {
  console.log(`JobIO Server is running on port: ${port}`);
})




