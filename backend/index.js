const express=require('express');
const app= express();
const { DBConnection }= require('./database/db.js');
const jwt = require('jsonwebtoken');
const bcrypt= require('bcryptjs');
const dotenv= require('dotenv');
const  router= require('./routes/routes.js')
const cors = require('cors');
const cookieParser = require('cookie-parser');
dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//MIDDLEWARES
app.use(express.json());
app.use(cookieParser())
//for accepting form data
app.use(express.urlencoded({extended: true}));


const corsOptions = {
    //origin: "https://btp-shipsy.vercel.app",
    origin: true,
    optionsSuccessStatus: 200 ,// Some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials :true
};
app.use(cors(corsOptions));

app.use('/',router);

DBConnection(); 
// app.get("/",(req,res)=>{
//     console.log("yo");
//     res.send("hi")
// })
