'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('CMSmall.db',(err) => {if(err) throw err;});

exports.db = db;