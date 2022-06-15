const express = require('express');
const router = express.Router();
const moment = require('moment');
const DB = require('../models/schedule');
const { isExpired } = require('react-jwt');


router.post('/create', async (req, res) => {
    try {
        const schedule = await DB.find();
        schedule.forEach(async (schedule) => {
            const now = moment();
            const until = moment(schedule.UseUntil);
            if (until.isBefore(now)) {
                await DB.deleteOne({ _id: schedule._id });
            }
        });
        const { accessToken, topic, useUntil, startUse, time1, class1, time2, class2, time3, class3, time4, class4, time5, class5, time6, class6, time7, class7, time8, class8, time9, class9, time10, class10 } = req.body;
        if (!(accessToken && topic && useUntil && startUse)) {
            return res.status(400).json({ message: "Data missing" });
        }
        if (isExpired(accessToken)) return res.status(403).json({ message: "Token expired" });
        const newUseUntil = moment(useUntil).subtract(7, 'hours');
        const newStartUse = moment(startUse).subtract(7, 'hours');
        await DB.create({ Topic: topic, UseUntil: newUseUntil, StartUse: newStartUse, Time1: time1, Class1: class1, Time2: time2, Class2: class2, Time3: time3, Class3: class3, Time4: time4, Class4: class4, Time5: time5, Class5: class5, Time6: time6, Class6: class6, Time7: time7, Class7: class7, Time8: time8, Class8: class8, Time9: time9, Class9: class9, Time10: time10, Class10: class10 });
        return res.status(201).json({ message: "Schedule added" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

const checkIfInUse = (schedule) => {
    const now = moment();
    const startUse = moment(schedule.StartUse);
    const useUntil = moment(schedule.UseUntil);
    return startUse.isBefore(now) && useUntil.isAfter(now);
};

router.get('/get', async (req, res) => {
    try {
        const schedule = await DB.find();
        const filteredSchedule = schedule.filter(checkIfInUse);
        return res.status(200). json(filteredSchedule);
    } catch {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;