import StockEntry from "../../src/domain/entity/StockEntry";

test("não deve criar uma entrada no stock com quantidade negativa", function () {
    expect(() => new StockEntry(1, "in", -10)).toThrow(new Error("Invalid quantity"));
});