const request = require('supertest')
const {sequelize} = require('../models')
const app = require('../app');




// 테스트 실행전에 수행되는코드  afterAll , beforeEach afterEach 도 존재
beforeAll(async()=>{ 
    // db에 테이블을 생성하기  
    await sequelize.sync();
})


describe('POST /join',()=>{  // 가입테스트 
    test("로그인 안했으면 회원가입 수행",(done)=>{
        request(app)
            .post('/auth/join')
            .send({
                email:'rival15@naver.com',
                nick:"lalala",
                password:"dbsdud12",
            })
            .expect('Location','/')
            .expect(302,done);
    })
});


// 로그인 상태에서 가입시도 테스트 
describe('POST /join',()=>{ 
    //agent 생성 하나이상의 요청에 사용가능
    const agent = request.agent(app) 

    //로그인 수행
    beforeEach((done)=>{
        agent
            .post('/auth/login')
            .send({
                email:'rival15@naver.com',
                password:'dbsdud12',
            })
            .end(done);
    })


    //로그인 상태에서 회원가입 시도
    test('이미 로그인 했으면 redirect /',(done)=>{
        const message = encodeURIComponent('로그인한 상태 입니다');
        agent
            .post('/auth/join')
            .send({
                email:'rival15@naver.com',
                nick:"lalala",
                password:"dbsdud12",
            })
            .expect("Location",`/?error=${message}`)
            .expect(302,done);
    })
})

describe('POST /login',()=>{
    test("가입하지 않은 회원", async(done)=>{
        const message = encodeURIComponent('가입되지 않은 회원 입니다.')
        request(app)
            .post('/auth/login')
            .send({
                email:"rival14@naver.com",
                password:"dbsdud12"
            })
            //Location  헤더가 /인지 테스트
            .expect('Location',`/?loginError=${message}`)

            // done을 두번째 인수로 넣어서 테스트 종료 알림.
            .expect(302,done); 

    })

    test('로그인 수행',async(done)=>{
        request(app)
            .post('/auth/login')
            .send({
                email:"rival15@naver.com",
                password: 'dbsdud12',
            })
            .expect("Location",'/')
            .expect(302,done)
    })

    test("비밀번호 틀림",async(done)=>{
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.')
        request(app)
            .post('/auth/login')
            .send({
                email:'rival15@naver.com',
                password: 'dbsdud21'
            })
            .expect('Location',`/?loginError=${message}`)
            .expect(302,done)
    });
});


describe('GET /logout',()=>{
    test("로그인 되지 않은 상태에서 로그아웃",async(done)=>{
        request(app)
            .get('/auth/logout')
            .expect(403,done)
        });
    
    const agent = request.agent(app);
    beforeEach((done)=>{
        agent
            .post('/auth/login')
            .send({
                email:'rival15@naver.com',
                password:"dbsdud12"
            })
            .end(done);
    })


    test("로그아웃 수행",async(done)=>{
        agent
            .get('/auth/logout')
            .expect('Location','/')
            .expect(302,done);
    });
})




afterAll(async()=>{
    await sequelize.sync({force:true});
})