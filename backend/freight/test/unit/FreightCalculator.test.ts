import FreightCalculator from "../../src/domain/entity/FreightCalculator";

test("deve calcular o frete do produto com quantidade 1", function (){
    const freight = FreightCalculator.calculate(1000, 100, 30, 10, 3);
    expect(freight).toBe(30);
});

test("deve calcular o frete do produto com quantidade 3", function (){    
    const freight = FreightCalculator.calculate(1000, 100, 30, 10, 3, 3);
    expect(freight).toBe(90);
});


test("deve calcular o frete minímo do produto", function (){
    const freight = FreightCalculator.calculate(1000, 10, 10, 10, 0.9);
    expect(freight).toBe(10);
});