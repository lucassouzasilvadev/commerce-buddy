import AxiosAdapter from "../../src/infra/http/AxiosAdapter";

test("Deve validar o fluxo de autenticacao", async function (){
    const input = { 
        email: "lucas@gmail.com",
        password: "abc123",
        date: new Date("2024-02-10T10:00:00")
    }
    const httpClient = new AxiosAdapter();
    await httpClient.post("http://localhost:3004/signup", input);
    const response = await httpClient.post("http://localhost:3004/login", input);
    expect(response.token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzQGdtYWlsLmNvbSIsImlhdCI6MTcwNzU3MDAwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwfQ.yGhAkik06Ck0JOsuHWPVy5TO00f_dKrg2K4zMgFOt1I");
    const payload = await httpClient.post("http://localhost:3004/verify", { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzQGdtYWlsLmNvbSIsImlhdCI6MTcwNzU3MDAwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwfQ.yGhAkik06Ck0JOsuHWPVy5TO00f_dKrg2K4zMgFOt1I"});
    expect(payload.email).toBe("lucas@gmail.com");
});









