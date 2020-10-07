const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
describe('isLoggedIn',()=>{

    const res= {//Mocking res
        status: jest.fn(()=> res),// 함수를 모킹
        send:jest.fn(), 
    };
    const next = jest.fn(); // Mocking next


    test("로그인이 되어 있으면 isNotLoggedIn 이 에러를 응답해야 한다.",()=>{
        const req={
            isAuthenticated : jest.fn(()=> true),
        };

        // 테스트할 함수
        isLoggedIn(req,res,next);

        // 정확하게 몇번 호출되는지 체크하는 메서드
        expect(next).toBeCalledTimes(1);
    })
    test("로그인이 되어 있지 않으면 isNotLoggedIn 이 next를 호출해야 한다. ",()=>{
        const req = {
            isAuthenticated : jest.fn(()=>false),
        }

        //테스트할 함수
        isLoggedIn(req,res,next);

        // 특정 인수와 함께 호출되었는지 검사하는 메서드
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    })
})

describe('isNotLoggedIn',()=>{
    const res= {//Mocking res
        redirect: jest.fn(),
    };
    const next = jest.fn(); // Mocking next


    test("로그인이 되어 있지 않으면 isNotLoggedIn 이 next를 호출해야 한다. ",()=>{
        const req={
            isAuthenticated : jest.fn(()=> false),
        };

        // 테스트할 함수
        isNotLoggedIn(req,res,next);
        // 정확하게 몇번 호출되는지 체크하는 메서드
        expect(next).toBeCalledTimes(1);
    })
    test("로그인이 되어 있으면 isNotLoggedIn 이 에러를 응답해야 한다.",()=>{
        const req = {
            isAuthenticated : jest.fn(()=>true),
        }

        //테스트할 함수
        isNotLoggedIn(req,res,next);

        // 특정 인수와 함께 호출되었는지 검사하는 메서드
        const message = encodeURIComponent('로그인한 상태 입니다')
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    })
   


   
})