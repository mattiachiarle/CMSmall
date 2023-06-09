'use strict';

const crypto = require('crypto');
const db = require('../db/db.js');

const getUser = (email, password) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM Users WHERE email=?";
        db.get(sql,[email],function(err, row){
            if(err){
                reject(err);
            }
            else{
                if(!row){
                    reject("Invalid email or password");
                }
                else{
                    crypto.scrypt(password,row.salt,32,(err,computed_hash) => {
                        if(err){
                            reject(err);
                        }
                        else{
                            const equal = crypto.timingSafeEqual(computed_hash, Buffer.from(row.hash,'hex'));
                            if(equal){
                                resolve(row);
                            }
                            else{
                                reject("Invalid email or password");
                            }
                        }
                    })
                }
            }
        })
    })
}

exports.getUser = getUser;