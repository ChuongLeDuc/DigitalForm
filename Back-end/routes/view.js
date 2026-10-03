const express = require("express");
const path=require("path")
const fs=require("fs")
const router = express.Router();

router.use(express.static(path.join(__dirname,"../../Front-end/View")))

function sendFormView(req,res){
    const submission_code=req.params.form_code

    const separation=submission_code.split("-")
    let form_code=separation[0]+"-"+separation[1]

    const filepath=path.join(__dirname,"../../Front-end/View",form_code,form_code+".html")

    if(fs.existsSync(filepath)){
        res.sendFile(filepath)
    }else{
        return res.status(404).json({
            success:false,
            message:"Form không tồn tại"
        })
    }
}

router.get("/",(req,res)=>{
    res.redirect("/Input/index.html")
})

router.get("/new/:form_code",sendFormView)
router.get("/approve/:form_code",sendFormView)
router.get("/review/:form_code",sendFormView)

module.exports = router;