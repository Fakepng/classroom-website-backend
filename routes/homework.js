const express = require('express');
const router = express.Router();
const moment = require('moment');
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
        const newDateGiven = moment(dateGiven).subtract(7, 'hours');
        const newDateDue = moment(dateDue).subtract(7, 'hours');
        await DB.create({ Subject: subject, Topic: topic, Description: description, DateGiven: newDateGiven, DateDue: newDateDue });
        return res.status(201).json({ message: "Homework added" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post('/edit', async (req, res) => {
    try {
        const { accessToken, _id, Subject, Topic, Description, DateGiven, DateDue } = req.body;
        if (!(accessToken && _id && Subject && Topic && DateGiven && DateDue)) {
            return res.status(400).json({ message: "Data missing" });
        }
        if (isExpired(accessToken)) return res.status(403).json({ message: "Token expired" });
        const homework = await DB.findById(_id);
        if (!homework) return res.status(403).json({ message: "Homework not found" });
        await DB.updateOne({ _id }, { Subject, Topic, Description, DateGiven, DateDue })
        return res.status(200).json({ message: "Update successfully"})
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post('/delete', async (req, res) => {
    try {
        const { accessToken, _id } = req.body;
        if (!(accessToken && _id)) return res.status(400).json({ message: "Data missing" });
        if (isExpired(accessToken)) return res.status(403).json({ message: "Token expired" });
        const homework = await DB.findById(_id);
        if (!homework) return res.status(404).json({ message: "Homework not found" });
        await DB.deleteOne({ _id });
        return res.status(200).json({ message: "Homework deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;