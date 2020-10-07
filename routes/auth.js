// 회원가입 로그인 라우터

const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const {isLoggedIn, isNotLoggedIn} = require('./middlewares')
const User = require('../models/users')


const router = express.Router()

//회원가입 기능
router.post('/join',isNotLoggedIn, async(req,res,next)=>{
    const { email , nick ,password } = req.body // form 으로 받음
    try{
        const exUser = await User.findOne({where: {email}}) // 이메일 중복 조사
        if(exUser){
            return res.redirect('/join?error=exist')
        }
        const hash = await bcrypt.hash(password,12)// 비밀번호에 해시  적용 12번 해시
        await User.create({
            email,
            nick,
            password: hash,
        })//  사용자 생성

        return res.redirect('/')//index 페이지로 리다이렉트
    }catch(err){
        console.error(err)
        return next(err)
    }
})



//로그인 기능 
router.post('/login',isNotLoggedIn,(req,res,next)=>{
    passport.authenticate('local',(authError, user, info)=>{ //info 로그인 과정에서 오류 존재할때 
        if(authError){//인증실패  아이디 없음  error
            console.error(authError)
            return next(authError)
        }
        if(!user){// 로그인실패 비밀번호 불일치  null false {message}
            return res.redirect(`/?loginError=${info.message}`)
        }

        //사용자 정보 존재
        return req.login(user,(loginError)=>{  //req.login은 passport.serializeUser 를 호출 세션에 로그인 정보 저장
            if(loginError){
                console.error(loginError)
                return next(loginError) // 세션에 로그인 정보 저장 실패한 경우
            }
            return res.redirect('/')
        })
    })(req,res,next) // 미들웨어 내의 미들웨어 
})



router.get('/logout',isLoggedIn,(req,res)=>{
    req.logout()  //  req.user 객체를 제거
    req.session.destroy() // req.session 객체의 내용을 제거 
    res.redirect('/')
})



router.get('/kakao',passport.authenticate('kakao'))

router.get('/kakao/callback',passport.authenticate('kakao',{
    failureRedirect:'/',  //실패
}),(req,res)=>{
    res.redirect('/')// 성공
})

module.exports = router