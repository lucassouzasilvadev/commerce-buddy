import TokenGenerator from "../../src/domain/entity/TokenGenerator";
import User from "../../src/domain/entity/User";

test("Deve gerar o token do usuário", async function (){
    const user = await User.create("lucas@gmail.com", "abc123");
    const expiresIn = 1000000;
    const issueDate = new Date("2024-02-10T10:00:00");
    const tokenGenerator = new TokenGenerator("key");
    const token = tokenGenerator.generate(user, expiresIn, issueDate);
    expect(token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzQGdtYWlsLmNvbSIsImlhdCI6MTcwNzU3MDAwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwfQ.yGhAkik06Ck0JOsuHWPVy5TO00f_dKrg2K4zMgFOt1I");
});


test("Deve validar o token do usuário", async function (){
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzQGdtYWlsLmNvbSIsImlhdCI6MTcwNzU3MDAwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwfQ.yGhAkik06Ck0JOsuHWPVy5TO00f_dKrg2K4zMgFOt1I";
    const tokenGenerator = new TokenGenerator("key");
    const payload = tokenGenerator.verify(token);
    expect(payload).toBeDefined();
    expect(payload.email).toBe("lucas@gmail.com");
});

test("Deve tentar validar o token inválido", async function (){
    const token = ".eyJlbWFpbCI6Imx1Y2FzQGdtYWlsLmNvbSIsImlhdCI6MTcwNzU3MDAwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwfQ.yGhAkik06Ck0JOsuHWPVy5TO00f_dKrg2K4zMgFOt1I";
    const tokenGenerator = new TokenGenerator("key");
    expect(() => tokenGenerator.verify(token)).toThrow(new Error("invalid token"));
});