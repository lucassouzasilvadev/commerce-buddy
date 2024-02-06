import ProductRepository from "../repository/ProductRepository";
import FreightCalculator from "../../domain/entity/FreightCalculator";

export default class SimulateFreight {

    constructor (
        readonly productRepository: ProductRepository
    ) {

    }

    async execute(input: Input): Promise<Output>{    
        const output: Output = {
            freight: 0
        };
        if(input.items){
            for(const item of input.items){        
                const product = await this.productRepository.getProduct(item.idProduct);                
                const itemFreight = FreightCalculator.calculate(product, item.quantity);
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
    items: { idProduct: number, quantity: number }[],
}