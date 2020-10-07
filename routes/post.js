const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const {Post, Hashtag} = require('../models')
const { isLoggedIn } = require('./middlewares')

const router = express.Router()

try{
    fs.readdirSync('uploads')
}catch (error){
    console.error("uploads polder not exist create uploads polder")
    fs.mkdirSync('uploads')
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,cb){ //저장할 장소
            cb(null,'uploads/')
        },
        filename(req,file,cb){ // 저장되는 이름
            const ext = path.extname(file.originalname)
            cb(null,path.basename(file.originalname,ext)+Date.now()+ext)
        }
    }),
    limits:{fileSize: 5*1024*1024}
})


router.post('/img',isLoggedIn,upload.single('img'),(req,res)=>{  // 이미지 생성
    console.log(req.file)
    res.json({ url: `/img/${req.file.filename}`})
})


const upload2 = multer()

//데이터 형식이  multipart 이지만  이미지 데이터는 이전단계에서 처리
router.post('/',isLoggedIn,upload2.none(),async(req,res,next)=>{  // 포스트 생성
    try{
        const post = await Post.create({
            content:req.body.content,
            img : req.body.url,
            UserId: req.user.id,
        })

        const hashtags = req.body.content.match(/#[^\s#]+/g)
        if(hashtags){
            const result = await Promise.all(
                hashtags.map( tag=>{
                    return Hashtag.findOrCreate({
                        where: {title: tag.slice(1).toLowerCase()}
                    })
                }),
            )

            await post.addHashtags(result.map(r => r[0]))
        }

        res.redirect('/')
    }catch(err){
        console.error(err)
        next(err)
    }
})


module.exports = router

