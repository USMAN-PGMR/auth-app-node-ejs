const express = require('express')
const app = express();

const userModel = require('./models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const path = require('path');
const { isAuthenticated } = require('./middleware/auth'); // Import middleware

app.set('view engine', "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())

app.get('/', (req, res) => {
    res.render('index')
})

// ***********Register*****************
app.post('/create', async (req, res) => {
    let { username, email, password, age } = req.body;
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

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {

            let createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age
            })
            // set the token
            // let token= jwt.sign({unique thing},'secret')
            let token = jwt.sign({ email }, 'nveiugeuwigvbwi')
            res.cookie('token', token)

            res.redirect('/profile');
            console.log('userCreated')
        })
    })
})
// *************logout*******************
app.get("/logout", (req, res) => {
    // just remove the cookie
    res.cookie('token', '')
    console.log('user loged out')
    res.redirect('/')
})

// *************loginPage*******************
app.get("/login", (req, res) => {
    res.render('login')
})


// ****************login*****************
app.post("/login", async (req, res) => {
    // sab sy pahly chk krna k user jo email dy raha ha wo exist b krti ha k nai
    let user = await userModel.findOne({ email: req.body.email });
    // agr wo user na ho to osy notify krna 
    if (!user) return res.send('something went wrong')

    // ab password to encrapt krna 
    // bcrypt.compare(password from form ,hashed password,)
    bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
            // set the token
            // let token= jwt.sign({unique thing},'secret')
            let token = jwt.sign({ email:user.email }, 'nveiugeuwigvbwi')
            res.cookie('token', token)
            res.redirect('/profile');
            console.log('login success')
        }
        else res.send('something went wrong')
    })
})


// **Profile Page**
app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.user });
});

app.listen(8000)