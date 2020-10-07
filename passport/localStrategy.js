//로그인 전략 구현

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const User = require('../models/users')

module.exports = ()=>{
    passport.use(new LocalStrategy({
        usernameField:'email',  //req.body 의 속성명 
        passwordField:'password',
    }, async(email ,password, done )=>{ //done 은 passport.authenticate 의 콜백함수

        try{
            const exUser = await User.findOne({where:{email}})
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password)
                if(result){
                    done(null, exUser);
                }else{
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'})
                }
            }else{
                done(null,false,{message:'가입되지 않은 회원 입니다.'})
            }
        }catch(error){
            console.error(error)
            done(error)
        }
    }))
}
