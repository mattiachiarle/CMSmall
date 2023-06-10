'use strict';

const db = require('../db/db.js');

const getWebsiteName = () => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT name FROM Website";
        db.get(sql,function(err,row){
            if(err){
                reject(err);
            }
            else{
                resolve(row);
            }
        })
    })
}

const updateWebsiteName = (name) => {
    return new Promise((resolve,reject) => {
        const sql = "UPDATE Website SET name=?";
        db.run(sql,[name],function(err){
            if(err){
                reject(err);
            }
            else{
                resolve(true);
            }
        })
    })
}

exports.updateWebsiteName = updateWebsiteName;
exports.getWebsiteName = getWebsiteName;