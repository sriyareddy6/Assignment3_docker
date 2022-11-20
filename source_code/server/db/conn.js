const mongoose = require("mongoose");

module.exports = () => {
  const connenctionParams = {
    useNewUrlParser:true,
    useUnifiedTopology:true,
  };

  try{
    mongoose.connect(process.env.DB, connenctionParams)
    console.log("Connected to database successfully")
  }catch(error) {
    console.log("Errror")
  }
}