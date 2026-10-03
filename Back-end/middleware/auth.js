function requireLogIn(req,res,next){
    if(!req.session.loggedIn){
        req.session.returnto=req.baseUrl
        console.log(req.baseUrl)
        return res.redirect("/Login")
    }
    next()
}

module.exports=requireLogIn