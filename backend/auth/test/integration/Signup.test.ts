import UserRepository from "../../src/application/repository/UserRepository";
import Login from "../../src/application/usecase/Login";
import Signup from "../../src/application/usecase/Singup";
import User from "../../src/domain/entity/User";

test("deve criar uma conta para o usuário", async function () {
    const users: any = {}
    const userRepository: UserRepository = {
        async save (user: User): Promise<void>{
            users[user.email.value] = user
        },
        async get (email: string): Promise<User> {
            return users[email];
        } 
    }
    const signup = new Signup(userRepository);
    const input = { 
        email: "lucas@gmail.com",
        password: "abc123",
        date: new Date("2024-02-10T10:00:00")
    }
    await signup.execute(input);
    const login = new Login(userRepository);
    const output = await login.execute(input);
    expect(output.token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzQGdtYWlsLmNvbSIsImlhdCI6MTcwNzU3MDAwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwfQ.yGhAkik06Ck0JOsuHWPVy5TO00f_dKrg2K4zMgFOt1I");
});