import HttpClient from "../http/HttpClient";
import StockGateway, { Input } from "../../application/gateway/StockGateway";

export default class StockGatewayHttp implements StockGateway {

    constructor (readonly httpClient: HttpClient) {

    }
    
    async decrementStock (input: Input) {
        return await this.httpClient.post("http://localhost:3005/decrementStock", input);        
    }

}