'use strict';

const dayjs = require('dayjs');
const db = require('../db/db.js');

const createPage = (page) => {
    return new Promise((resolve,reject) => {
        const sql = "INSERT INTO Pages(title,creatorId,creatorUsername,creationDate,publicationDate) VALUES (?,?,?,?,?)";
        db.run(sql,[page.title,page.creatorId,page.creatorName,page.creationDate.format('YYYY-MM-DD'),page.publicationDate? page.publicationDate.format('YYYY-MM-DD'):""],function(err){
            if(err){
                console.log(err);
                reject(err);
            }
            else{
                resolve(this.lastID);
            }
        })
    })
}

const updatePage = (id, title, publicationDate) => {
    return new Promise((resolve,reject) => {
        const sql = "UPDATE Pages SET title=?, publicationDate=? WHERE id=?";
        db.run(sql,[title,publicationDate,id],function(err){
            if(err){
                reject(err);
            }
            else{
                resolve(true);
            }
        })
    })
}

const deletePage = id => {
    return new Promise((resolve,reject) => {
        const sql = "DELETE FROM Pages WHERE id=?";
        db.run(sql,[id],(err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        })
    })
}

const updateAuthor = (pageId, creatorId, creatorName) => {
    return new Promise((resolve,reject) => {
        const sql = "UPDATE Pages SET creatorId=?, creatorUsername=? WHERE id=?";
        db.run(sql,[creatorId,creatorName,pageId],function(err){
            if(err){
                reject(err);
            }
            else{
                resolve(true);
            }
        })
    })
}

const getPublicPages = () => {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT * FROM Pages WHERE publicationDate!="" AND publicationDate<=?';
        db.all(sql,[dayjs().format('YYYY-MM-DD')],(err, rows) => {
            if(err)
                reject(err);
            else{
                resolve(rows);
            }
        })
    })
}

const getAllPages = () => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM Pages";
        db.all(sql,(err, rows) => {
            if(err)
                reject(err);
            else{
                resolve(rows);
            }
        })
    })
}

const getPage = (id) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM Pages WHERE id=?";
        db.get(sql,[id],(err, row) => {
            if(err)
                reject(err);
            else{
                resolve(row);
            }
        })
    })
}

exports.createPage = createPage;
exports.updatePage = updatePage;
exports.deletePage = deletePage;
exports.updateAuthor = updateAuthor;
exports.getPublicPages = getPublicPages;
exports.getAllPages = getAllPages;
exports.getPage = getPage;