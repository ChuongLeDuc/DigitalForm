const express = require("express");
const path=require("path")
const router = express.Router();

router.use(express.static(path.join(__dirname,"../../Front-end/Approve")))
router.get("/",(req,res)=>{
    res.redirect("/Approve/index.html")
})

module.exports = router;