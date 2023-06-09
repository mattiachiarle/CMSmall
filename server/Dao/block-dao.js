'use strict';

const db = require('../db/db.js');

const createBlock = (block) => {
    return new Promise((resolve,reject) => {
        const sql = "INSERT INTO Blocks(type,content,pageId,position) VALUES (?,?,?,?)";
        db.run(sql,[block.type, block.content, block.pageId, block.position],(err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        })
    })
}

const updateBlock = (id, content, position) => {
    return new Promise((resolve,reject) => {
        const sql = "UPDATE Blocks SET content=?, position=? WHERE id=?";
        db.run(sql,[content,position,id],function(err){
            if(err){
                reject(err);
            }
            else{
                resolve(true);
            }
        })
    })
}

const deleteBlock = id => {
    return new Promise((resolve,reject) => {
        const sql = "DELETE FROM Blocks WHERE id=?";
        db.run(sql,[id],(err) => {
            if(err)
                reject(err);
            else
                resolve(true);
        })
    })
}

const getPageBlocks = id => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM Blocks WHERE pageId=?";
        db.all(sql,[id],(err, rows) => {
            if(err)
                reject(err);
            else{
                resolve(rows);
            }
        })
    })
}

exports.createBlock = createBlock;
exports.updateBlock = updateBlock;
exports.deleteBlock = deleteBlock;
exports.getPageBlocks = getPageBlocks;