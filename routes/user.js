const express = require('express');
const router = express.Router();
const DB = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const aesjs = require('aes-js');

router.post('/register', async (req, res) => {
    try {
        const { user, password } = req.body
        if (!(user && password)) {
            return res.status(400).json({ message: "Data missing" });
        }

        const oldUser = DB.findOne({ user });
        if (oldUser.user === user) return res.status(409).send("User already exists");

        const key = process.env.AES_KEY.split(', ').map(function(item) {
            return parseInt(item, 10);
        });
        const encryptedBytes = aesjs.utils.hex.toBytes(password);
        const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);
        const decryptedPassword = aesjs.utils.utf8.fromBytes(decryptedBytes);

        const hashPassword = await bcrypt.hash(decryptedPassword, 10); 
        const newUser = await DB.create({ user, password: hashPassword });
        const username = newUser.user;
        const token = jwt.sign(
            { user_id: newUser._id, username },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        newUser.token = token;
        return res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post('/login', async (req, res) => {
    try {
        const { user, password } = req.body;
        if (!(user && password)) {
            return res.status(400).json({ message: "Data missing" });
        }

        const oldUser = await DB.findOne({ user });
        const username = oldUser.user;

        const key = process.env.AES_KEY.split(', ').map(function(item) {
            return parseInt(item, 10);
        });
        const encryptedBytes = aesjs.utils.hex.toBytes(password);
        const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);
        const decryptedPassword = aesjs.utils.utf8.fromBytes(decryptedBytes);

        if (oldUser && (await bcrypt.compare(decryptedPassword, oldUser.password))) {
            const token = jwt.sign(
                { oldUser_id: oldUser._id, username },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            oldUser.token = token;
            return res.status(200).json(oldUser);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.get('/first', async (req, res) => {
    try {
        const user = await DB.create({ user: "kinpkt", password: "$2a$10$PH2C4NtmVI6aLbsxwAekDu4MgRif93ySfacSlLYnX9bzv2CuOpb72" });
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
})

module.exports = router;