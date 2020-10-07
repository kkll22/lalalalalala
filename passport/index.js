const passport = require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')
const User = require('../models/users')

module.exports = ()=>{

    passport.serializeUser((user,done)=>{ 
        done(null,user.id) // 로그인시 실행  세션에 저장
        //req.session 객체에 저장할 정보

    })

    //실제 서비스 경우에  redis에 캐싱
    passport.deserializeUser((id,done)=>{ //passport.session 미들웨어 에서 호출
        
        
        User.findOne({
            where:{id},
            include : [{
                model:User,
                attributes:['id','nick'],
                as : 'Followers',
            }, {
                model:User,
                attributes:['id','nick'],
                as :'Followings',
            }]
            })
        .then(user => done(null, user))  //조회정보를 req.user 에 저장
        .catch(err => done(err))
    })


    local()
    kakao()
}