import Password from "../../src/domain/entity/Password";

const PASSWORD_TEST = "bd2615764cdf90d3f7467d0de0ca5e5cc87eaedf03471a462c354767e8ded32658a99116d16a2d45dca94a723d3535019125459b9dbaeb53960d8c11283289c2";

test("Deve criar uma senha", async function(){
    const password = await  Password.create("abc123", "salt");
    expect(password.value).toBe(PASSWORD_TEST);
    expect(password.salt).toBe("salt");
});

test("deve validar uma senha", async function () {
    const password = new Password(PASSWORD_TEST, "salt");
    const isValid = await password.validate("abc123");
    expect(isValid).toBeTruthy();
});
 