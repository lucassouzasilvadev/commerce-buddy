import DistanceCalculator from "../../src/domain/entity/DistanceCalculator";
import Coord from "../../src/domain/entity/Coord";

test("Deve calcular a distância entre dois ceps", function (){
    const from = new Coord(-27.5945, -48.5477);
    const to = new Coord(-22.9129, -43.2003);
    const distance = DistanceCalculator.calculate(from, to);
    expect(distance).toBe(748.2217780081631);
});

