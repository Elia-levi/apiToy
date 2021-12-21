const express = require("express");
const { ToyModel, validateToy } = require("../models/toyModel");
const { auth } = require("../middlewares/auth")
const router = express.Router();

router.get("/", async (req, res) => {
    let searchQ = req.query.s;
    let searchRegExp = new RegExp(searchQ, "i");
    let perPage = 10;
    let page = (req.query.page >= 1) ? req.query.page - 1 : 0;
    try {
        if (searchRegExp) {
            let data = await ToyModel.find({ $or: [{ name: searchRegExp }, { info: searchRegExp }] })
                .limit(Number(perPage))
                .skip(page * perPage)
            res.json(data);
        }
        else {
            let data = await ToyModel.find({})
                .limit(Number(perPage))
                .skip(page * perPage)
            res.json(data);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Page and perPage must be 1+ or DB down , come back later" });
    }
})

router.get("/cat/:catname", async (req, res) => {
    let catname = req.params.catname;
    let perPage = 10;
    let page = (req.query.page >= 1) ? req.query.page - 1 : 0;
    try {
        let data = await ToyModel.find({ category: catname })
            .limit(Number(perPage))
            .skip(page * perPage)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.get("/prices", async (req, res) => {
    let minq=req.query.min||0;
    let maxq=req.query.max||99999;
    let perPage = 10;
    let page = (req.query.page >= 1) ? req.query.page - 1 : 0;
    try {
        let data = await ToyModel.find({$and:[{"price":{$gte:minq}},{"price":{$lte:maxq}}]})
        .limit(Number(perPage))
        .skip(page * perPage)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.post("/", auth, async (req, res) => {
    let validBody = validateToy(req.body)
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let toy = new ToyModel(req.body);
        toy.user_id = req.tokenData._id;
        await toy.save();
        res.status(201).json(toy);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.put("/:idEdit", auth, async (req, res) => {
    let validBody = validateToy(req.body)
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let idEdit = req.params.idEdit
        let data = await ToyModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body);
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.delete("/:idDel", auth, async (req, res) => {
    let idDel = req.params.idDel;
    try {
        let data = await ToyModel.deleteOne({ _id: idDel, user_id: req.tokenData._id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;