'use strict';

const PORT = 3000;

//SERVER MANAGEMENT

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

//USEFUL QUERIES

const {createBlock, updateBlock, deleteBlock, getPageBlocks} = require('./Dao/block-dao.js');
const {createPage, updatePage, deletePage, updateAuthor, getPublicPages, getAllPages} = require('./Dao/page-dao.js');
const {getUser} = require('./Dao/user-dao.js');
const {updateWebsiteName} = require('./Dao/website-dao.js');

//AUTHENTICATION

const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

//DELAY

function delay(req, res, next) {
    setTimeout(()=>{next()}, 1000) ;
}
app.use(delay);

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

//SESSION INITIALIZATION

app.use(session({
    secret: "ExamCMSmall", resave: false, saveUninitialized: false
}));

//AUTHENTICATION INITIALIZATION

passport.use(new LocalStrategy(function verify(username, password, callback){
    getUser(username,password).then((user) => callback(null,user)).catch(err => callback(null, false, err));
}))

passport.serializeUser((user, callback) => {
    return callback(null, {id: user.id, email: user.email, name: user.username, role: user.role});
})

passport.deserializeUser((user, callback) => {
    return callback(null, user);
})

app.use(passport.authenticate('session'));

//NON-AUTHENTICATED APIs

app.post('/api/login',passport.authenticate('local'),(req,res) => {
    res.json(req.user);
})

app.post('/api/logout',(req,res) => {
    req.logout(() => res.end());
})

app.get('/api/pages/:mode',(req,res) => {
    //get all the pages(homepage), TBD
    //if mode=frontoffice no checks
    //if mode=backoffice checks on authentication
})

app.get('/api/pages/:pageid',(req,res) => {
    //view a specific page, TBD
})

//AUTHENTICATED

const isLogged = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.status(500).send("Not authenticated");
    }
}

app.use(isLogged);

app.post('/api/pages',(req,res) => {
    //create a new page, TDB
    //implement checks
})

app.put('/api/pages/:pageid',(req,res) => {
    //update a page, TDB
    //implement a check on author of the page+role
    //implement checks
})

app.delete('/api/pages/:pageid',(req,res) => {
    //delete a page, TDB
    //implement a check on author of the page+role
})

//AUTHENTICATED, ADMIN EXCLUSIVE

const isAdmin = () => {
    //implement check on admin role
}

app.use(isAdmin);

app.put('/api/pages/:pageid/author',(req,res) => {
    //update author of the page, TDB
    //implement a check on role
})

app.put('/api/website',(req,res) => {
    //update website name, TDB
    //implement a check on author of the page+role
})

app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });