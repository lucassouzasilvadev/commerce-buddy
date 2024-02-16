import Verify from "../../src/application/usecase/Verify";


test("deve verificar um token", async function () {
    const verfy = new Verify();
    const payload = await verfy.execute("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzQGdtYWlsLmNvbSIsImlhdCI6MTcwNzU3MDAwMDAwMCwiZXhwaXJlc0luIjoxMDAwMDAwfQ.yGhAkik06Ck0JOsuHWPVy5TO00f_dKrg2K4zMgFOt1I");
    expect(payload.email).toBe("lucas@gmail.com");
});