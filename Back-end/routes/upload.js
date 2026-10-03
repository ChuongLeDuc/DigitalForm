const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const code = String(req.body.code);
        console.log(code,"HẺE")
        const code_part = code.split("-");
        const day = code_part[2].slice(0, 2);
        const month = code_part[2].slice(2, 4);
        const year = code_part[2].slice(4, 6);
        const shift = code_part[3];
        const formCode = code_part[0]+"-"+code_part[1];

        const saving_path = path.join("../Images/Forms",year,month,day,shift,formCode);
        console.log(saving_path)
        fs.mkdirSync(saving_path, {
            recursive: true
        });

        const files=fs.readdirSync(saving_path)
        
        files.forEach(file=>{
          const filename= path.parse(file).name
          console.log(file)
          if(filename===req.body.code) fs.unlinkSync(path.join(saving_path,file))
        })

        cb(null, saving_path);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null,req.body.code + extension);
    }
});

const upload = multer({storage: storage});
const allowIMG = [{name: "review-img",maxCount: 10},{name: "sign-img",maxCount: 10}];

router.post("/image",upload.fields(allowIMG),(req, res) => { //Uplpad 1 img/times
        const img_field = Object.keys(req.files)
        const infor=req.files[img_field][0]

        const raw_path=`${infor["destination"].slice(2)}/${infor["filename"]}`
        const img_path=String(raw_path).replaceAll("\\","/")

        console.log("IMAGE CODE:", req.body.code, img_path);
        res.status(200).json({
            success:true,
            message:"Upload anhr thanhf coong",
            img_path:img_path
        });
    }
);

module.exports = router;