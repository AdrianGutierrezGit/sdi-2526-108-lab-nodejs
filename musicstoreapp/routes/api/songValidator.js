const {check,param} = require('express-validator');
const songsRepository = require("../../repositories/songsRepository");
const {ObjectId} = require("mongodb");


exports.songValidatorInsert = [
    check('title','Title is required').trim().not().isEmpty(),
    check('title','Title must be 5 or more characters').trim().isLength({min: 5}),
    check('kind','Kind is required').trim().not().isEmpty(),
    check('kind','Kind must be 3 or more characters').trim().isLength({min: 3}),
    check('price','Price is required').trim().not().isEmpty(),
    check('price','Price must be a number').isNumeric()
]
