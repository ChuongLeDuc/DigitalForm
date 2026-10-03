const express=require("express")
const session=require("express-session")
const cors=require("cors")
const path=require("path")

const auth_router=require("./routes/auth")
const upload_router=require("./routes/upload")
const input_router=require("./routes/input")
const view_router=require("./routes/view")
const approve_router=require("./routes/approve")
const api_router=require("./routes/api")

const requireLogIn=require("./middleware/auth")

const app=express()

app.use(express.json())
app.use(cors())
app.use(session({
    secret:"H8-secret",
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        maxAge:1000*15*60
    }
}))

app.use("/Login",auth_router)
app.use("/Upload",requireLogIn,upload_router)
app.use("/Input",requireLogIn,input_router)
app.use("/Approve",requireLogIn,approve_router)
app.use("/View",requireLogIn,view_router)
app.use("/api",requireLogIn,api_router)

app.use("/Images",requireLogIn,express.static(path.join(__dirname,"../Images")))

app.get("/",(req,res)=>{
    res.redirect("/Input")
})

app.listen(3000,()=>{
    console.log("Server Running.....")
})
