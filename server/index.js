'use strict';

const PORT = 3000;

//SERVER MANAGEMENT

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dayjs = require('dayjs');

//USEFUL QUERIES

const {createBlock, updateBlock, deleteBlock, deletePageBlocks, getPageBlocks} = require('./Dao/block-dao.js');
const {createPage, updatePage, deletePage, updateAuthor, getPublicPages, getAllPages, getPage} = require('./Dao/page-dao.js');
const {getUser, getUserId} = require('./Dao/user-dao.js');
const {updateWebsiteName} = require('./Dao/website-dao.js');
const {Page} = require('./Models/pageModel.js');
const {Block} = require('./Models/blockModel.js');

//AUTHENTICATION

const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

//DELAY

function delay(req, res, next) {
    setTimeout(()=>{next()}, 1000) ;
}
app.use(delay);

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

const getCompletePage = (page) => {
    try{
        let blocks = getPageBlocks(page.id);
        blocks = blocks.map((b) => ({
            id:b.id,
            type:b.type,
            content:b.content,
            position:b.position
        }));
        return {
            id:page.id,
            title: page.title,
            author:page.creatorUsername,
            creationDate:page.creationDate,
            blocks:blocks
        }
    }
    catch(error){
        throw error;
    }
}

app.get('/api/pages/:mode', async (req,res) => {
    if(req.params.mode == 'backoffice'){
        if(!req.isAuthenticated()){
            return res.status(401).send("To access the backoffice you must perform login!");
        }
        else{
            try{
                const pages = await getAllPages();
                const result = pages.map((p) => {
                    return getCompletePage(p);
                })
                return res.json(result);
            }
            catch(error){
                return res.status(500).send(error.message);
            }
        }
    }
    else if(req.params.mode == 'frontoffice'){
        try{
            const pages = await getPublicPages();
            const result = pages.map((p) => {
                return getCompletePage(p);
            })
            return res.json(result);
        }
        catch(error){
            return res.status(500).send(error.message);
        }
    }
    else{
        return res.status(404).send("Invalid value of mode");
    }
})

const checkAuth = (req,author) => {
    if(req.isAuthenticated() && (req.user.userRole == 'Admin' || author == req.user.username)){
        return true;
    }
    else{
        return false;
    }
}

const checkPageView = (date, author, req) => {
    if(date > dayjs().format('YYYY-MM-DD')){
        return checkAuth(req,author);
    }
    return true;
}

app.get('/api/pages/:pageid', async (req,res) => {
    try{
        const page = await getPage(req.params.pageid).catch((error) => res.status(500).send(error));
        if(!page){
            return res.status(404).send("Page not found");
        }
        if(!checkPageView(page.date,page.creatorUsername,req)){
            return res.status(401).send("You are not authorized to see this page");
        }
        const result = getCompletePage(page);
        return res.json(result);
    }
    catch(error){
        return res.status(500).send(error.message);
    }
})

//AUTHENTICATED

const isLogged = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.status(401).send("Not authenticated");
    }
}

app.use(isLogged);

const checkPage = (blocks) => {
    let countHeader=0;
    let countParagraph=0;
    let countImage=0;
    let error = false;
    let wrongPosition = false;
    let prev = -1;

    blocks.sort((a,b) => a.position - b.position);

    for(const b of blocks){
        if(b.type=='header'){
            countHeader++;
        }
        if(b.type=='paragraph'){
            countParagraph++;
        }
        if(b.type=='image'){
            countImage++;
        }
        if(b.content==''){
            error=true;
        }
        if(prev==-1){
            prev=b.position;
        }
        else{
            if(prev!=b.position-1){
                wrongPosition=true;
            }
            prev=b.position;
        }
    }

    if(error){
        return {correct:false, cause:"You can't create an empty block"}
    }
    if(countHeader==0){
        return {correct:false, cause:"The page must have at least one header"}
    }
    if(countImage==0 && countParagraph==0){
        return {correct:false, cause:"The page must have at least one image or one paragraph"}
    }
    if(wrongPosition){
        return {correct:false, cause:"The positions of the blocks are not correct"}
    }

    return {correct: true}
}

app.post('/api/pages', async (req,res) => {
    try{
        const page = new Page(null,req.body.title,req.user.id,req.user.username,dayjs(),req.body.publicationDate?dayjs(req.body.publicationDate):null);
        console.log(page);
        const check = checkPage(req.body.blocks);
        if(!check.correct){
            return res.status(400).send(check.cause);
        }
        const pageId = await createPage(page);
        req.body.blocks.forEach(async (b) => {
            const block = new Block(null,b.type,b.content,pageId,b.position);
            await createBlock(block);
        })
        return res.end();
    }
    catch(error){
        return res.status(500).send(error.message);
    }
})

app.put('/api/pages/:pageid', async (req,res) => {
    try{
        const existingPage = await getPage(req.params.pageid);
        if(!existingPage){
            return res.status(400).send("Page not found");
        }
        if(!checkAuth(req,existingPage.creatorUsername)){
            return res.status(401).send("You are not authorized to update this page");
        }
        const check = checkPage(req.body.blocks);
        if(!check.correct){
            return res.status(400).send(check.cause);
        }
        await updatePage(req.params.pageid,req.body.title,req.body.publicationDate);
        req.body.updatedBlocks.forEach(async (b) => {
            await updateBlock(b.id,b.content,b.position);
        })
        req.body.deletedBlocks.forEach(async (b) => {
            await deleteBlock(b.id);
        })

        return res.end();
    }
    catch(error){
        return res.status(500).send(error.message);
    }
})

app.delete('/api/pages/:pageid', async (req,res) => {
    try{
        const existingPage = await getPage(req.params.pageid);
        if(!existingPage){
            return res.status(400).send("Page not found");
        }
        if(!checkAuth(req,existingPage.creatorUsername)){
            return res.status(401).send("You are not authorized to delete this page");
        }
        await deletePage(req.params.pageid);
        await deletePageBlocks(req.params.pageid);

        return res.end();
    }
    catch(error){
        return res.status(500).send(error.message);
    }
})

//AUTHENTICATED, ADMIN EXCLUSIVE

const isAdmin = (req,res,next) => {
    if(req.user.userRole == 'admin'){
        next();
    }
    else{
        res.status(401).send("Not an admin");
    }
}

app.use(isAdmin);

app.put('/api/pages/:pageid/author', async (req,res) => {
    try{
        const userId = await getUserId(req.body.author);
        if(!userId){
            return res.status(400).send("User not found");
        }
        await updateAuthor(req.params.pageid,userId,req.body.author);
    }
    catch(error){
        return res.status(500).send(error.message);
    }
})

app.put('/api/website', async (req,res) => {
    try{
        await updateWebsiteName(req.body.name);
    }
    catch(error){
        return res.status(500).send(error.message);
    }
})

app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/`) });