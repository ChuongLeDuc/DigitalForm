const express = require("express");
const path=require("path")
const router = express.Router();

router.use(express.static(path.join(__dirname,"../../Front-end/Input")))
router.get("/",(req,res)=>{
    res.redirect("/Input/index.html")
})

module.exports = router;