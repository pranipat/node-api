'use strict';
const jwt  = require('jsonwebtoken');

const SECRET_KEY = "JWT_SECRET_KEY_APP_API";
const COLLECTION = process.env.DB_USER_COLLECTION_NAME || 'users';

class Users {

    constructor(req,res) {
       this.Collection = req.app.locals.db.collection(COLLECTION);
    }

    createOne(firstName, surname, username, password){
        return new Promise((resolve,reject) => {
            this.Collection.insertOne({
                firstName,
                surname,
                username,
                password,
            }, (err, result) => {
              if (err) {
                reject(err);
              }else{
                resolve(result);
              }
            })
        });
    }

    isUsernameTaken(username) {
        return new Promise((resolve,reject) => {
            this.Collection.findOne({username}, (err, result) => {
              if (err) {
                reject(err);
              }else{
                resolve(result);
              }
            })
        });

    }

    userSignin(username,password){
        return new Promise((resolve,reject) => {
            this.Collection.findOne({username,password}, (err, result) => {
              if (err) {
                reject(err);
              }else{
                resolve(result);
              }
            })
        });
    }

    generateAuthToken(userData){
      return jwt.sign(userData, SECRET_KEY,{ expiresIn: 60 * 60 });
    }

    decodeAuthToken(token){
      return jwt.decode(token, SECRET_KEY);
    }

    verifyToken(token){
      return new Promise((resolve,reject) => {
        jwt.verify(token, SECRET_KEY, function(err, decoded) {
          if (err) {
            reject(err);
          }
          resolve(decoded);
        });
      });
    }

}

module.exports = Users;