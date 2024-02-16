import ZipCodeRepository from "../../src/application/repository/ZipCodeRepository";
import CalculateFreight from "../../src/application/usecase/CalculateFreight";
import ZipCode from "../../src/domain/entity/ZipCode";

let calculateFreight: CalculateFreight;


beforeEach(function(){
    const zipCodeRepository: ZipCodeRepository = {
        async get (code: string): Promise<ZipCode | undefined> {
            if (code === "22060030"){
                return new ZipCode("22060030", "", "", -27.5945, -48.5477);
            }
            if (code === "88015600"){
                return new ZipCode("88015600", "", "", -22.9129, -43.2003);
            }
        }
    }
    calculateFreight = new CalculateFreight(zipCodeRepository);
});

afterEach(async function (){
});

test("Deve calcular o frete para um pedido com 2 itens sem cep de origem e destino", async function() {
    const input = {
        items: [
            { width: 100, height: 30, length: 10, weight: 3, quantity: 2 }
        ]
    }
    const output = await calculateFreight.execute(input);
    expect(output.freight).toBe(60);
});

test("Deve calcular o frete para um pedido com 2 itens com cep de origem e destino", async function() {
    const input = {
        items: [
            { width: 100, height: 30, length: 10, weight: 3, quantity: 1 }
        ],
        from: "22060030",
        to: "88015600"
    }
    const output = await calculateFreight.execute(input);
    expect(output.freight).toBe(22.446653340244893);
});
