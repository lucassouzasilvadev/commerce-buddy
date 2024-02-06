import Coupon from "../../src/domain/entity/Coupon";

test("Deve criar um coupon de desconto válido", function(){
    const coupon = new Coupon("VALE20", 20, new Date("2024-10-02T10:00:00"));
    expect(coupon.isExpired(new Date("2024-02-01T10:00:00"))).toBeFalsy();
});

test("Deve criar um coupon de desconto inválido", function(){
    const coupon = new Coupon("VALE20", 20, new Date("2024-10-02T10:00:00"));
    expect(coupon.isExpired(new Date("2024-12-01T10:00:00"))).toBeTruthy();
});

test("Deve calcular o desconto", function(){
    const coupon = new Coupon("VALE20", 20, new Date("2024-10-02T10:00:00"));
    expect(coupon.calculateDiscount(1000)).toBe(200);
});