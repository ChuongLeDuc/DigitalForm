const express =require("express")
const path=require("path")
const bcrypt=require("bcrypt")

const pool=require("../db.js")

const router=express.Router()

router.use(express.static(path.join(__dirname,"../../Front-end/Login")))
router.get("/",(req,res)=>{
    if(req.session.loggedIn) return res.redirect("/Input/")
    res.redirect("/Login/login.html")
})

router.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/Login/login.html")
    })
})

router.post("/login",async(req,res)=>{
    const username=req.body.username
    const password=req.body.password
    const returnto=req.session.returnto
    
    try{
        const query=await pool.query(
            `SELECT id, username, fullname, password_hash, signature
            FROM users WHERE username=$1 AND is_active=TRUE`,[username]
        )

        if(query.rows.length===0){
            return res.status(401).json({
                message:"Sai tên đăng nhập hoặc mật khẩu",
                success:false
            })
        }

        const user=query.rows[0]
        const match=await bcrypt.compare(password,user.password_hash)

        if(!match) return res.status(401).json({
            message:"Sai mật khẩu hoặc tên đăng nhập",
            success:false
        })

        req.session.loggedIn = true;
        req.session.userId = user.id;
        req.session.fullname = user.fullname;
        req.session.signature = user.signature;
        
        res.status(200).json({
            message: "Đăng nhập thành công",
            success:true,
            returnTo:returnto
        });

    }catch(err){
        console.log("Có lỗi xảy ra",err)
        res.status(500).json({
            message:"Lỗi đăng nhập",
            success:false
        })
    }
})

module.exports=router