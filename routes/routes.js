'use strict';

const express = require('express');
const router = express.Router();

const Users = require('../models/Users');
const Search = require('../models/Search');

router.post('/signup', async (req, res, next) => {
    try {
        const newUser = new Users(req);
        let userExists = await newUser.isUsernameTaken(req.body.username);
        if(userExists){
            res.status(400).send({status:false,error: 'User Name already taken. Please try with a different one!'});
        }else{
            await newUser.createOne(req.body.firstName, req.body.surname,req.body.username, req.body.password);
            res.status(200).send({status:true,message:'success'});
        }
    } catch (error) {
        res.status(400).send({status:false,error});
    }
});

module.exports = router;

router.post('/login',async (req, res, next) => {
    try {
        const User = new Users(req);
        let userSignin = await User.userSignin(req.body.username, req.body.password);
        if(userSignin){
            const token = User.generateAuthToken(userSignin);
            res.header("Authorization", `Bearer ${token}`).status(200).send({status:true,message:'success'});
        }else{
            res.status(400).send({status:false,error:'Invalid username or password!'});
        }
    } catch (error) {
        res.status(400).send({status:false,error});
    }
});

router.get('/api/v1/oscar/search/:year', async (req, res, next) => {
    try {
        const search  = new Search(req);
        let result = await search.findByYear(req.params.year);
        if (result === undefined || result.length === 0) {
            res.status(400).send({status:false,'error':'No document found!'});
        } else {
            result.map(ret => {
                ret.id = ret._id;
                delete ret._id;
            });
            res.status(200).send({status:true,message:result});
        } 
    } catch (error) {
        res.status(400).send({status:false,error});
    } 
});

router.get('/api/v1/session/isLoggedIn', async (req, res, next) => {
    try {
        var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        if(!token){
            res.status(400).send({status:false,'error':'Missing x-access-token!'}); 
        }else{
            const User = new Users(req);
            const verifiedToken = await User.verifyToken(token);
            if(verifiedToken === undefined){
                res.status(400).send({status:false,error: 'Token has expired!'});
            }else{
                res.status(200).send({status:true,message:verifiedToken});
            }
        }
    } catch (error) {
        res.status(400).send({status:false,error});
    } 
});

router.get('/api/v1/session/name', async (req, res, next) => {
    try {
        var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        if(!token){
            res.status(400).send({status:false,'error':'Missing x-access-token!'}); 
        }else{
            const User = new Users(req);
            const exp = User.decodeAuthToken(token).firstName;
            res.status(200).send({status:true,message:firstName});
        }
    } catch (error) {
        res.status(400).send({status:false,error});
    } 
});

router.get('/', async (req, res, next) => {
    try {
        res.status(200).send({status:true,message:'Blockchain-Api'});
    } catch (error) {
        res.status(400).send({status:false,error});
    }
});