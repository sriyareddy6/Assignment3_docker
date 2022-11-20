require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());
const dbo = require("./db/conn");
const userRoutes = require("./routes/userHandler");

dbo()

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use("/api/user", userRoutes);

const errorHandler = (err, req, res, next) => {
  if(req.headersSent) {
    return next(err);
  }
  res.status(500).json({error: err});
}

app.use(errorHandler);

app.get('/sum_2_numbers',function(req,res){
  res.header("Access-Control-Allow-Origin", "*")

  var n1=Number(req.query.firstNumber);
  var n2=Number(req.query.secondNumber);
  var sum;
  sum=n1+n2;
  
  let summation = {
      result: sum 
  };
  res.end(JSON.stringify(summation));
}
);
