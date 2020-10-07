

exports.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        next()
    } else{
        res.status(403).send('로그인 필요')
    }
}

exports.isNotLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){//passport 가  req 객체에 추가해줌
        next()
    }else{
        const message = encodeURIComponent('로그인한 상태 입니다')
        res.redirect(`/?error=${message}`)
    }
}