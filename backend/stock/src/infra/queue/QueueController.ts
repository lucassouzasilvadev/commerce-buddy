import DecrementStock from "../../application/usecase/DecrementStock";
import Queue from "./Queue";

export default class QueueController {
 
    constructor (readonly queue: Queue, readonly decrementStock: DecrementStock) {
        queue.on("orderPlaced", function(input: any){
            decrementStock.execute(input);
        });
    }

}