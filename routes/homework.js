const express = require('express');
const router = express.Router();
const DB = require('../models/homework');
const { isExpired } = require('react-jwt');

router.get('/get', async (req, res) => {
    try {
        const homework = await DB.find();
        res.status(200).json(homework);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post('/add', async (req, res) => {
    try {
        const { accessToken, subject, topic, description, dateGiven, dateDue } = req.body;
        if (!(accessToken && subject && topic && dateDue)) {
            return res.status(400).json({ message: "Data missing" });
        }
        if (isExpired(accessToken)) return res.status(403).json({ message: "Token expired" });
        await DB.create({ Subject: subject, Topic: topic, Description: description, DateGiven: dateGiven, DateDue: dateDue });
        return res.status(201).json({ message: "Homework added" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;