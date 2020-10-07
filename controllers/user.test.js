jest.mock('../models/users.js')
const User = require('../models/users')
const { addFollowing } = require('./user')

describe('addFollowing',()=>{
    const req = {
        user:{id:1},
        params:{id:2},
    }
    const res = {
        status: jest.fn(()=>res),
        send: jest.fn(),

    }
    const next= jest.fn()
    test("사용자를 찾아 팔로잉을 추가하고 success 를 응답하는지 테스트", async()=>{
        
        User.findOne.mockReturnValue(Promise.resolve({
            addFollowing(id){
                return Promise.resolve(true);
            }
        }));
        await addFollowing(req,res,next);
        expect(res.send).toBeCalledWith('success');
    })

    test('사용자를 못 찾으면 res.status(404).send(no user) 를 호출함',async()=>{
        User.findOne.mockReturnValue(null);

        await addFollowing(req,res,next);
        expect(res.status).toBeCalledWith(404)
        expect(res.send).toBeCalledWith('no user');
    })

    test('DB에서 에러가 발생하면 next(error)를 호출한다', async()=>{
        const error="테스트용에러";
        User.findOne.mockReturnValue(Promise.reject(error));
        await addFollowing(req,res,next);
        expect(next).toBeCalledWith(error);
    })
})