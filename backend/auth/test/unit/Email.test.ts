import Email from "../../src/domain/entity/Email";

test("deve criar um email válido", function(){
    const email = new Email("lucas@gmail.com");
    expect(email.value).toBe("lucas@gmail.com");
});

test("não deve criar um email inválido", function(){
   expect(() => new Email("lucas@gmail")).toThrow(new Error("Invalid email"));
});




