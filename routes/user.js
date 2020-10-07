const express = require('express')

const { isLoggedIn }=require('./middlewares')
const { addFollowing } = require('../controllers/user')
//const User = require('../models/users')

const router = express.Router()



//팔로우 하는 기능
// router.post('/:id/follow',isLoggedIn,async(req,res,next)=>{ // async를 독립적으로 만들기 
//     try{
//         const user = await User.findOne({where: {id:req.user.id}})
//         if(user){
//             await user.addFollowing(parseInt(req.params.id,10))
//             res.send('success')
//         }else{
//             res.status(404).send('no user')
//         }
//     }catch(err){
//         console.error(err)
//         next(err)
//     }
// })

router.post('/:id/follow',isLoggedIn,addFollowing)



module.exports = router