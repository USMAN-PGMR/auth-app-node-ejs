const express = require('express')
const app = express();

const userModel=require('./models/userModel')


const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const path = require('path')

app.set('view engine', "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.render('index')
})

// ***********Register*****************
app.post('/create',async(req,res)=>{
    let {username,email,password,age}=req.body;
// ----------------user create with simple manner like without hash password --------------
//     let createdUser= await userModel.create({
//         username,
//         email,
//         password,
//         age
//     })
//     res.send(createdUser)
//     console.log('userCreated')
// })


// ---------now with bcrypt

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async(err,hash)=>{

        let createdUser= await userModel.create({
            username,
            email,
            password:hash,
            age
        })
        // set the token
        // let token= jwt.sign({unique thing},'secret')
        let token= jwt.sign({email},'nveiugeuwigvbwi')
        res.cookie('token',token)

        res.send(createdUser)
        console.log('userCreated')
    })
    })
})



app.listen(8000)