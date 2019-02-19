const express = require('express');
const router = express.Router()

//@route    GET api/post/test
//@route    Test post route
//@route    Public
router.get('/test', (req, res) => res.json({message: "post works "}))

module.exports= router;