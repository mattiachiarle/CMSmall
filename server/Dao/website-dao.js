'use strict';

const db = require('../db/db.js');

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