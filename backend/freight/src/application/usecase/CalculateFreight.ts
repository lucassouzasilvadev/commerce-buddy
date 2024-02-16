import DistanceCalculator from "../../domain/entity/DistanceCalculator";
import FreightCalculator from "../../domain/entity/FreightCalculator";
import ZipCodeRepository from "../repository/ZipCodeRepository";

export default class CalculateFreight {

    constructor (readonly zipCodeRepository: ZipCodeRepository) {

    }

    async execute(input: Input): Promise<Output>{    
        const output: Output = {
            freight: 0
        };
        let distance = 1000;
        if (input.from && input.to){
            const from = await this.zipCodeRepository.get(input.from);
            const to = await this.zipCodeRepository.get(input.to);
            if (from && to) {
                distance = DistanceCalculator.calculate(from.coord, to.coord);
            }
        }
 
        if(input.items){
            for(const item of input.items){        
                const itemFreight = FreightCalculator.calculate(distance, item.width, item.height, item.length, item.weight, item.quantity);
                output.freight += itemFreight;
            }   
        }              
        return output;                
    }
}

type Output = {
    freight: number
}

type Input = {
    items: { width: number, height: number, length: number, weight: number, quantity: number }[],
    from?: string,
    to?: string
}