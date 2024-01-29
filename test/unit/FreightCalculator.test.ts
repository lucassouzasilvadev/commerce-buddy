import FreightCalculator from "../../src/domain/entity/FreightCalculator";
import Product from "../../src/domain/entity/Product";

test("deve calcular o frete do produto com quantidade 1", function (){
    const product = new Product(6, "A",1000, 100, 30, 10, 3, "USD");
    const freight = FreightCalculator.calculate(product);
    expect(freight).toBe(30);
});

test("deve calcular o frete do produto com quantidade 3", function (){
    const product = new Product(6, "A",1000, 100, 30, 10, 3, "USD");
    const freight = FreightCalculator.calculate(product, 3);
    expect(freight).toBe(90);
});


test("deve calcular o frete minímo do produto", function (){
    const product = new Product(6, "C",1000, 10, 10, 10, 0.9, "USD");
    const freight = FreightCalculator.calculate(product);
    expect(freight).toBe(10);
});